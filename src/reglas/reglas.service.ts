import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { ActuadoresService } from '../actuadores/actuadores.service'
import { LoggerService } from '../logger/logger.service'
import { MqttService } from '../mqtt/mqtt.service'
import { SensoresService } from '../sensores/sensores.service'

import { CreateReglaDto } from './dto/create-regla.dto'
import { UpdateReglaDto } from './dto/update-regla.dto'
import { Regla } from './entities/regla.entity'

@Injectable()
export class ReglasService {
  constructor(
    @InjectRepository(Regla) private repo: Repository<Regla>,
    private sensoresService: SensoresService,
    private actuadoresService: ActuadoresService,
    private mqttService: MqttService,
    private logger: LoggerService
  ) {
    this.logger.setContext('ReglasService')
  }

  async create(createDto: CreateReglaDto): Promise<Regla> {
    this.logger.log(`Creando regla: ${createDto.nombre} de tipo: ${createDto.tipo}`)

    // Validar campos según el tipo de regla
    if (createDto.tipo === 'sensor') {
      if (!createDto.sensorId || !createDto.comparador || createDto.valor_trigger === undefined || !createDto.accion) {
        throw new BadRequestException(
          'Para reglas de tipo sensor, los campos sensorId, comparador, valor_trigger y accion son requeridos'
        )
      }
    } else if (createDto.tipo === 'horario') {
      if (!createDto.hora_inicio || !createDto.hora_fin || !createDto.accion_inicio || !createDto.accion_fin) {
        throw new BadRequestException(
          'Para reglas de tipo horario, los campos hora_inicio, hora_fin, accion_inicio y accion_fin son requeridos'
        )
      }
    }

    const regla = this.repo.create({
      ...createDto,
      sensor: createDto.sensorId ? ({ id: createDto.sensorId } as any) : undefined,
      actuador: { id: createDto.actuadorId } as any,
      dispositivo: createDto.dispositivoId ? ({ id: createDto.dispositivoId } as any) : undefined,
      valor_trigger: createDto.valor_trigger,
      delay_segundos: createDto.delay_segundos || 0
    })

    const saved = await this.repo.save(regla)
    this.logger.log(`Regla ${createDto.tipo} creada con ID: ${saved.id}`)
    await this.triggerSync(saved)
    return saved
  }

  async findAll(): Promise<Regla[]> {
    return this.repo.find({ relations: ['sensor', 'actuador', 'dispositivo'] })
  }

  async findOne(id: number): Promise<Regla> {
    const regla = await this.repo.findOne({
      where: { id },
      relations: ['sensor', 'actuador', 'dispositivo']
    })

    if (!regla) {
      this.logger.error(`Regla con ID ${id} no encontrada`)
      throw new NotFoundException(`Regla con ID ${id} no encontrada`)
    }

    return regla
  }

  async update(id: number, updateDto: UpdateReglaDto): Promise<Regla> {
    const regla = await this.findOne(id)
    this.logger.log(`Actualizando regla ID: ${id}`)

    if (updateDto.sensorId) {
      regla.sensor = { id: updateDto.sensorId } as any
    }

    if (updateDto.actuadorId) {
      regla.actuador = { id: updateDto.actuadorId } as any
    }

    if (updateDto.dispositivoId !== undefined) {
      regla.dispositivo = updateDto.dispositivoId ? ({ id: updateDto.dispositivoId } as any) : undefined
    }

    if (updateDto.valor_trigger !== undefined) {
      regla.valor_trigger = updateDto.valor_trigger
    }

    if (updateDto.delay_segundos !== undefined) {
      regla.delay_segundos = updateDto.delay_segundos
    }

    Object.assign(regla, updateDto)
    await this.repo.save(regla)

    // Volver a cargar la regla con todas las relaciones
    const updated = await this.findOne(id)

    this.logger.log(`Regla ID ${id} actualizada`)
    await this.triggerSync(updated)
    return updated
  }

  async remove(id: number): Promise<void> {
    const regla = await this.findOne(id)
    this.logger.log(`Eliminando regla ID: ${id}`)

    await this.repo.remove(regla)
    this.logger.log(`Regla ID ${id} eliminada`)
    await this.triggerSync(regla)
  }

  async toggle(id: number): Promise<Regla> {
    const regla = await this.findOne(id)
    regla.habilitada = !regla.habilitada

    this.logger.log(`Regla ID ${id} ${regla.habilitada ? 'habilitada' : 'deshabilitada'}`)
    const saved = await this.repo.save(regla)
    await this.triggerSync(saved)
    return saved
  }

  async findByDispositivo(id: number): Promise<Regla[]> {
    const reglas = this.repo.find({ where: { dispositivoId: id }, relations: ['sensor', 'actuador', 'dispositivo'] })
    if (!reglas) {
      this.logger.error(`No existen reglas para el dispositivo con ID ${id}`)
      throw new NotFoundException(`No existen reglas para el dispositivo con ID ${id}`)
    }
    return reglas
  }

  async sincronizarReglas(deviceId: number) {
    const reglas = await this.repo.find({
      where: [
        { dispositivo: { id: deviceId }, habilitada: true },
        { sensor: { gpio: { dispositivo: { id: deviceId } } }, habilitada: true },
        { actuador: { gpio: { dispositivo: { id: deviceId } } }, habilitada: true }
      ],
      relations: [
        'sensor',
        'actuador',
        'dispositivo',
        'sensor.gpio',
        'actuador.gpio',
        'sensor.gpio.dispositivo',
        'actuador.gpio.dispositivo'
      ]
    })

    const payload = reglas.map(r => ({
      id: r.id,
      nombre: r.nombre,
      tipo: r.tipo,
      // Mapear campos relevantes para el dispositivo
      sensorId: r.sensor?.id,
      actuadorId: r.actuador.id,
      gpioSensor: r.sensor?.gpio?.pin,
      gpioActuador: r.actuador.gpio.pin,
      comparador: r.comparador,
      valor_trigger: r.valor_trigger,
      accion: r.accion,
      delay: r.delay_segundos,
      hora_inicio: r.hora_inicio,
      hora_fin: r.hora_fin,
      accion_inicio: r.accion_inicio,
      accion_fin: r.accion_fin,
      dias: r.dias_semana
    }))

    const topic = `dispositivos/${deviceId}/reglas`
    this.logger.log(`Sincronizando ${reglas.length} reglas para dispositivo ${deviceId} en ${topic}`)
    await this.mqttService.publish(topic, payload)
  }

  private async obtenerDispositivoIdDeRegla(regla: Regla): Promise<number | undefined> {
    if (regla.dispositivoId) return regla.dispositivoId
    if (regla.sensor?.gpio?.dispositivo?.id) return regla.sensor.gpio.dispositivo.id
    if (regla.actuador?.gpio?.dispositivo?.id) return regla.actuador.gpio.dispositivo.id

    const r = await this.repo.findOne({
      where: { id: regla.id },
      relations: [
        'dispositivo',
        'sensor',
        'actuador',
        'sensor.gpio',
        'actuador.gpio',
        'sensor.gpio.dispositivo',
        'actuador.gpio.dispositivo'
      ]
    })
    if (r?.dispositivo?.id) return r.dispositivo.id
    if (r?.sensor?.gpio?.dispositivo?.id) return r.sensor.gpio.dispositivo.id
    if (r?.actuador?.gpio?.dispositivo?.id) return r.actuador.gpio.dispositivo.id
    return undefined
  }

  async triggerSync(regla: Regla) {
    try {
      const deviceId = await this.obtenerDispositivoIdDeRegla(regla)
      if (deviceId) {
        await this.sincronizarReglas(deviceId)
      } else {
        this.logger.warn(`No se pudo determinar el dispositivo para sincronizar regla ${regla.id}`)
      }
    } catch (e) {
      this.logger.error(`Error sincronizando regla ${regla.id}: ${e.message}`, e.stack)
    }
  }

  // @Cron('*/10 * * * * *')
  @Cron('0 * * * * *')
  async ejecutarReglas() {
    const reglas = await this.repo.find({
      where: { habilitada: true, tipo: 'sensor' },
      relations: ['sensor', 'actuador']
    })

    if (reglas.length > 0) {
      this.logger.debug(`[CRON SENSOR] Verificando ${reglas.length} reglas de sensor`)
    }

    for (const regla of reglas) {
      if (!regla.sensor) continue

      const lectura = await this.sensoresService.obtenerUltimaLectura(regla.sensor.id)
      if (!lectura) {
        this.logger.warn(`[Regla ${regla.nombre}] No se pudo obtener lectura para sensor ${regla.sensor.id}`)
        continue
      }

      const cumple = this.comparar(Number(lectura.valor), regla.comparador!, Number(regla.valor_trigger))

      this.logger.debug(
        `[Regla ${regla.nombre}] Sensor: ${lectura.valor} ${regla.comparador} ${regla.valor_trigger} ? ${cumple ? 'SÍ' : 'NO'}`
      )

      if (cumple) {
        const delay = regla.delay_segundos || 0

        if (delay > 0) {
          this.logger.log(
            `Regla ${regla.nombre}: Condición cumplida. Ejecutando acción "${regla.accion}" en ${delay} segundos`
          )
          setTimeout(async () => {
            await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion as any)
            this.logger.log(`Regla ${regla.nombre}: Acción "${regla.accion}" ejecutada después de ${delay} segundos`)
          }, delay * 1000)
        } else {
          await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion as any)
        }
      }
    }
  }

  @Cron('10 * * * * *')
  async ejecutarReglasHorario() {
    this.logger.debug(`[CRON HORARIO] Ejecutando reglas horario`)
    const reglasHorario = await this.repo.find({
      where: { habilitada: true, tipo: 'horario' },
      relations: ['actuador']
    })

    const reglasSensor = await this.repo.find({
      where: { habilitada: true, tipo: 'sensor' }
    })

    const ahora = new Date()
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
    const diaActual = ahora.getDay()

    this.logger.debug(
      `[CRON] Verificando reglas - Hora: ${horaActual}, Día: ${diaActual} | Horario: ${reglasHorario.length} | Sensor: ${reglasSensor.length}`
    )

    for (const regla of reglasHorario) {
      if (regla.dias_semana && regla.dias_semana.length > 0) {
        if (!regla.dias_semana.includes(diaActual)) {
          continue
        }
      }

      if (regla.hora_inicio === horaActual && regla.accion_inicio) {
        const delay = regla.delay_segundos || 0

        if (delay > 0) {
          this.logger.log(`Regla horario ${regla.nombre}: Programando "${regla.accion_inicio}" en ${delay} segundos`)
          setTimeout(async () => {
            await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion_inicio as any)
            this.logger.log(
              `Regla horario ${regla.nombre}: "${regla.accion_inicio}" ejecutada después de ${delay} segundos`
            )
          }, delay * 1000)
        } else {
          this.logger.log(`Ejecutando regla horario ${regla.nombre}: ${regla.accion_inicio} a las ${horaActual}`)
          await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion_inicio as any)
        }
      }

      if (regla.hora_fin === horaActual && regla.accion_fin) {
        const delay = regla.delay_segundos || 0

        if (delay > 0) {
          this.logger.log(`Regla horario ${regla.nombre}: Programando "${regla.accion_fin}" en ${delay} segundos`)
          setTimeout(async () => {
            await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion_fin as any)
            this.logger.log(
              `Regla horario ${regla.nombre}: "${regla.accion_fin}" ejecutada después de ${delay} segundos`
            )
          }, delay * 1000)
        } else {
          this.logger.log(`Ejecutando regla horario ${regla.nombre}: ${regla.accion_fin} a las ${horaActual}`)
          await this.actuadoresService.ejecutarAccion(regla.actuador.id, regla.accion_fin as any)
        }
      }
    }
  }

  private comparar(actual: number, cmp: string, valor: number) {
    switch (cmp) {
      case '>':
        return actual > valor
      case '<':
        return actual < valor
      case '>=':
        return actual >= valor
      case '<=':
        return actual <= valor
      case '=':
        return actual === valor
    }
    return false
  }
}
