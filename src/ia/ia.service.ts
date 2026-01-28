import { GoogleGenerativeAI } from '@google/generative-ai'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { CultivosService } from '../cultivos/cultivos.service'
import { Lectura } from '../lecturas/entities/lectura.entity'
import { LecturasService } from '../lecturas/lecturas.service'
import { AnalisisManualDto } from './dto/analisis-manual.dto'
import { NutricionService } from '../nutricion/nutricion.service'
import { IaAnalisis } from './entities/ia-analisis.entity'

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name)

  constructor(
    @InjectRepository(IaAnalisis)
    private readonly iaAnalisisRepo: Repository<IaAnalisis>,
    private readonly cultivosService: CultivosService,
    private readonly nutricionService: NutricionService,
    private readonly lecturasService: LecturasService,
    private readonly configService: ConfigService
  ) { }

  async getCultivoSnapshot(cultivoId: number) {
    const cultivo = await this.cultivosService.findOne(cultivoId)

    if (!cultivo) {
      throw new Error(`Cultivo con ID ${cultivoId} no encontrado`)
    }

    const start = new Date()
    start.setHours(start.getHours() - 24)
    const end = new Date()

    // Obtener lecturas de las últimas 24h filtradas por la sala del cultivo a través del servicio de lecturas
    const lecturas = await this.lecturasService.findRecentReadingsBySala(cultivo.salaId, start, end)

    // Agrupar por dispositivo y tipo de sensor
    const resumenDispositivos = this.procesarLecturasPorDispositivo(lecturas)

    // Obtener últimos riegos a través del servicio de nutrición
    const riegos = await this.nutricionService.findByCultivo(cultivoId)
    const ultimosRiegos = riegos.slice(-3).reverse()
    return {
      cultivo: {
        nombre: cultivo.nombre,
        estado: cultivo.estado,
        dias_ciclo: cultivo.dias_ciclo,
        sala: cultivo.sala.nombre,
        medio_cultivo: cultivo.medioCultivo ? cultivo.medioCultivo.nombre : 'No especificado'
      },
      dispositivos: resumenDispositivos,
      nutricion: ultimosRiegos.map(r => ({
        semana: r.semana,
        tipo: r.tipo_riego,
        ph: r.ph,
        ec: r.ec,
        litros: r.litros_agua,
        productos: r.productos
      }))
    }
  }

  private procesarLecturasPorDispositivo(lecturas: Lectura[]) {
    const dispositivosMap = new Map<number, any>()

    lecturas.forEach(l => {
      const sensor = l.sensor
      const gpio = sensor?.gpio
      const dispositivo = gpio?.dispositivo
      const tipo = sensor?.tipo

      if (!dispositivo || !tipo) return

      if (!dispositivosMap.has(dispositivo.id)) {
        dispositivosMap.set(dispositivo.id, {
          id: dispositivo.id,
          nombre: dispositivo.nombre,
          lecturas: {}
        })
      }

      const dispData = dispositivosMap.get(dispositivo.id)
      if (!dispData.lecturas[tipo]) {
        dispData.lecturas[tipo] = { suma: 0, count: 0, unidad: l.sensor.unidad }
      }

      dispData.lecturas[tipo].suma += Number(l.valor)
      dispData.lecturas[tipo].count++
    })

    // Convertir el Map a array y calcular promedios
    return Array.from(dispositivosMap.values()).map(d => {
      const sensores = {}
      for (const [tipo, data] of Object.entries(d.lecturas)) {
        sensores[tipo] = {
          promedio: Number(((data as any).suma / (data as any).count).toFixed(2)),
          unidad: (data as any).unidad
        }
      }
      return {
        id: d.id,
        nombre: d.nombre,
        sensores
      }
    })
  }

  async generarAnalisis(cultivoId: number) {
    const analisisExistente = await this.buscarAnalisisHoy(cultivoId)

    if (analisisExistente) {
      this.logger.log(
        `Ya existe un análisis para el cultivo ${cultivoId} del día de hoy. Retornando análisis existente.`
      )
      return {
        id: analisisExistente.id,
        snapshot: analisisExistente.snapshot,
        analisis_prediccion: analisisExistente.analisis,
        origen: analisisExistente.origen,
        es_cache: true,
        fecha: analisisExistente.fecha
      }
    }

    const snapshot = await this.getCultivoSnapshot(cultivoId)
    return this.procesarYGuardarAnalisis(cultivoId, snapshot, 'sensor')
  }

  async generarAnalisisManual(cultivoId: number, datosManuales: AnalisisManualDto) {
    const analisisExistente = await this.buscarAnalisisHoy(cultivoId)

    if (analisisExistente) {
      this.logger.log(
        `Ya existe un análisis para el cultivo ${cultivoId} del día de hoy (Manual). Retornando análisis existente.`
      )
      return {
        id: analisisExistente.id,
        snapshot: analisisExistente.snapshot,
        analisis_prediccion: analisisExistente.analisis,
        origen: analisisExistente.origen,
        es_cache: true,
        fecha: analisisExistente.fecha
      }
    }

    const snapshot = await this.getManualSnapshot(cultivoId, datosManuales)
    return this.procesarYGuardarAnalisis(cultivoId, snapshot, 'manual')
  }

  async verificarAnalisisHoy(cultivoId: number) {
    const analisis = await this.buscarAnalisisHoy(cultivoId)
    return {
      existe: !!analisis,
      origen: analisis?.origen || null,
      fecha: analisis?.fecha || null,
      analisisId: analisis?.id || null
    }
  }

  private async buscarAnalisisHoy(cultivoId: number): Promise<IaAnalisis | null> {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    return await this.iaAnalisisRepo.findOne({
      where: {
        cultivoId,
        fecha: Between(hoy, manana) as any
      },
      order: { fecha: 'DESC' }
    })
  }

  private async procesarYGuardarAnalisis(cultivoId: number, snapshot: any, origen: 'sensor' | 'manual') {
    const prompt = this.construirPrompt(snapshot)
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')?.trim()

    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      this.logger.error('GEMINI_API_KEY no encontrada o valor por defecto')
      return {
        snapshot,
        analisis_prediccion:
          'API Key de Gemini no configurada o inválida. Por favor, configure GEMINI_API_KEY en su archivo .env',
        prompt_debug: prompt
      }
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const nuevoAnalisis = this.iaAnalisisRepo.create({
        cultivoId,
        snapshot,
        analisis: text,
        origen
      })
      await this.iaAnalisisRepo.save(nuevoAnalisis)

      this.logger.log(`Nuevo análisis generado (${origen}) y guardado para el cultivo ${cultivoId}`)

      return {
        id: nuevoAnalisis.id,
        snapshot,
        analisis_prediccion: text,
        origen: nuevoAnalisis.origen,
        es_cache: false,
        fecha: nuevoAnalisis.fecha
      }
    } catch (error) {
      this.logger.error(`Error al generar análisis con Gemini: ${error.message}`)
      return {
        snapshot,
        analisis_prediccion: `Error al procesar con IA: ${error.message}`,
        prompt_debug: prompt
      }
    }
  }

  async getManualSnapshot(cultivoId: number, datos: AnalisisManualDto) {
    const cultivo = await this.cultivosService.findOne(cultivoId)

    if (!cultivo) {
      throw new Error(`Cultivo con ID ${cultivoId} no encontrado`)
    }

    const riegos = await this.nutricionService.findByCultivo(cultivoId)
    const ultimosRiegos = riegos.slice(-3).reverse()

    return {
      cultivo: {
        nombre: cultivo.nombre,
        estado: cultivo.estado,
        dias_ciclo: cultivo.dias_ciclo,
        sala: cultivo.sala.nombre,
        medio_cultivo: cultivo.medioCultivo ? cultivo.medioCultivo.nombre : 'No especificado'
      },
      dispositivos: [
        {
          id: 0,
          nombre: 'Entrada Manual de Usuario',
          lecturas: {
            temperatura: { promedio: datos.temperatura, unidad: '°C' },
            humedad: { promedio: datos.humedad, unidad: '%' },
            ph: datos.ph ? { promedio: datos.ph, unidad: 'pH' } : undefined,
            ec: datos.ec ? { promedio: datos.ec, unidad: 'mS/cm' } : undefined
          }
        }
      ],
      nutricion: ultimosRiegos.map(r => ({
        semana: r.semana,
        tipo: r.tipo_riego,
        ph: r.ph,
        ec: r.ec,
        litros: r.litros_agua,
        productos: r.productos
      })),
      notas_manuales: datos.notas_usuario
    }
  }

  async getHistorial(cultivoId: number) {
    return await this.iaAnalisisRepo.find({
      where: { cultivoId },
      order: { fecha: 'DESC' },
      take: 10
    })
  }

  async getAnalisisPorCama(camaId: number) {
    const cultivos = await this.cultivosService.findAll()
    const cultivosDeCama = cultivos.filter(c => c.camaId === camaId)

    if (cultivosDeCama.length === 0) {
      return {
        camaId,
        cultivos: [],
        mensaje: 'No se encontraron cultivos en esta cama'
      }
    }

    const analisisPorCultivo = await Promise.all(
      cultivosDeCama.map(async cultivo => {
        const analisisReciente = await this.iaAnalisisRepo.findOne({
          where: { cultivoId: cultivo.id },
          order: { fecha: 'DESC' }
        })

        return {
          cultivoId: cultivo.id,
          cultivoNombre: cultivo.nombre,
          estado: cultivo.estado,
          analisis: analisisReciente
            ? {
              id: analisisReciente.id,
              fecha: analisisReciente.fecha,
              analisis: analisisReciente.analisis,
              snapshot: analisisReciente.snapshot,
              origen: analisisReciente.origen
            }
            : null
        }
      })
    )

    return {
      camaId,
      cultivos: analisisPorCultivo,
      total: analisisPorCultivo.length,
      conAnalisis: analisisPorCultivo.filter(c => c.analisis !== null).length
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async analizarCultivosActivos() {
    this.logger.log('Iniciando análisis proactivo de IA para cultivos activos...')

    // Necesitamos cargar las relaciones de sala y usuario para verificar permisos
    const cultivosActivos = await this.cultivosService.findActivos()

    for (const cultivo of cultivosActivos) {
      try {
        // Obtenemos el cultivo con su sala y usuario
        const completo = await this.cultivosService.findOne(cultivo.id)
        const usuario = completo?.sala?.usuario

        if (!usuario) {
          this.logger.warn(`No se pudo encontrar el usuario para el cultivo ${cultivo.id}. Saltando.`)
          continue
        }

        // Si el usuario no tiene el módulo de dispositivos, no ejecutamos el análisis proactivo (pago)
        const tieneModuloDispositivos = usuario.modulos?.some(m => m.slug === 'dispositivos')

        if (!tieneModuloDispositivos) {
          this.logger.debug(
            `Usuario ${usuario.usuario} no tiene el módulo de dispositivos activo. Saltando análisis proactivo para ${cultivo.nombre}.`
          )
          continue
        }

        this.logger.debug(`Procesando IA para cultivo: ${cultivo.nombre}`)
        await this.generarAnalisis(cultivo.id)
      } catch (error) {
        this.logger.error(`Fallo en análisis automático para cultivo ${cultivo.id}: ${error.message}`)
      }
    }

    this.logger.log('Análisis proactivo completado.')
  }

  private construirPrompt(snapshot: any): string {
    const dispositivosStr = snapshot.dispositivos
      .map(d => `- Dispositivo "${d.nombre}": ${JSON.stringify(d.sensores)}`)
      .join('\n')

    return `Eres un expert agrónomo especializado en cultivo indoor de cannabis. 
                Analiza los siguientes datos registrados en la sala "${snapshot.cultivo.sala}":
                
                Cultivo: ${snapshot.cultivo.nombre}
                Estado actual: ${snapshot.cultivo.estado}
                Día del ciclo: ${snapshot.cultivo.dias_ciclo}
                Medio de Cultivo: ${snapshot.cultivo.medio_cultivo}
                
                Condiciones ambientales por dispositivo (promedios últimas 24h):
                ${dispositivosStr}
                
                Último riego registrado: ${JSON.stringify(snapshot.nutricion[0] || 'Sin datos')}

                Proporciona un diagnóstico detallado del estado actual y recomendaciones técnicas para los próximos 3 días.`
  }
}
