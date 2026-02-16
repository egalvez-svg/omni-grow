import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { CambiarFaseDto } from './dto/cambiar-fase.dto'
import { VariedadService } from '../variedad/variedad.service'
import { CreateCultivoDto } from './dto/create-cultivo.dto'
import { UpdateCultivoDto } from './dto/update-cultivo.dto'
import { Cultivo } from './entities/cultivo.entity'
import { SalasService } from '../salas/salas.service'
import { MediosCultivoService } from '../medios-cultivo/medios-cultivo.service'
import { FasesService } from '../fases/fases.service'
import { CultivoFasesHistorialService } from '../cultivo-fases-historial/cultivo-fases-historial.service'

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
    private readonly variedadService: VariedadService,
    private readonly salasService: SalasService,
    private readonly mediosCultivoService: MediosCultivoService,
    private readonly fasesService: FasesService,
    private readonly historialService: CultivoFasesHistorialService
  ) { }

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    const { variedadIds, ...cultivoData } = dto

    // Validar que la sala existe
    await this.salasService.findOne(dto.salaId)

    // Validar y obtener las variedades
    const variedades = await Promise.all(
      variedadIds.map(id => this.variedadService.findOne(id))
    )

    // Validar medio de cultivo si se proporciona
    if (dto.medioCultivoId) {
      const medio = await this.mediosCultivoService.findOne(dto.medioCultivoId)
      if (!medio) {
        throw new NotFoundException(`Medio de cultivo con ID ${dto.medioCultivoId} no encontrado`)
      }
    }

    const cultivo: Cultivo = this.cultivoRepo.create({
      ...cultivoData,
      variedades
    })
    const savedCultivo = await this.cultivoRepo.save(cultivo)

    // Si se especificó una fase inicial, crear el historial
    if (dto.faseId) {
      await this.transicionarFase(savedCultivo.id, { nuevaFaseId: dto.faseId, notas: 'Fase inicial' })
    }

    return await this.findOne(savedCultivo.id)
  }

  async findAll(): Promise<Cultivo[]> {
    return await this.cultivoRepo.find({
      relations: ['sala', 'cama', 'variedades', 'plantas', 'nutricionSemanal', 'medioCultivo'],
      order: { creado_en: 'DESC' }
    })
  }

  async findActivos(): Promise<Cultivo[]> {
    // Buscar la fase "finalizado" para excluirla
    const faseFinalizado = await this.fasesService.findBySlug('finalizado')

    return await this.cultivoRepo.find({
      where: faseFinalizado ? { faseId: Not(faseFinalizado.id) } : {},
      relations: ['sala', 'cama', 'variedades', 'plantas', 'nutricionSemanal', 'medioCultivo', 'faseActual'],
      order: { creado_en: 'DESC' }
    })
  }

  async findBySala(salaId: number): Promise<Cultivo[]> {
    return await this.cultivoRepo.find({
      where: { salaId },
      relations: ['sala', 'sala.dispositivos', 'cama', 'variedades', 'plantas', 'nutricionSemanal', 'medioCultivo'],
      order: { creado_en: 'DESC' }
    })
  }

  async findOne(id: number): Promise<Cultivo> {
    const cultivo = await this.cultivoRepo.findOne({
      where: { id },
      relations: [
        'sala',
        'sala.dispositivos',
        'cama',
        'variedades',
        'plantas',
        'nutricionSemanal',
        'nutricionSemanal.productos',
        'nutricionSemanal.productos.productoNutricion',
        'medioCultivo',
        'faseActual',
        'historialFases',
        'historialFases.fase'
      ]
    })
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${id} no encontrado`)
    }
    return cultivo
  }

  async update(id: number, dto: UpdateCultivoDto): Promise<Cultivo> {
    const { variedadIds, ...updateData } = dto
    const cultivo = await this.findOne(id)

    if (updateData.salaId && updateData.salaId !== cultivo.salaId) {
      await this.salasService.findOne(updateData.salaId)
    }

    if (updateData.camaId && updateData.camaId !== cultivo.camaId) {
      const sala = await this.salasService.findOne(cultivo.salaId)
      const cama = sala.camas?.find(c => c.id === updateData.camaId)
      if (!cama) {
        throw new NotFoundException(`Cama con ID ${updateData.camaId} no encontrada en la sala`)
      }
    }

    if (updateData.medioCultivoId && updateData.medioCultivoId !== cultivo.medioCultivoId) {
      const medio = await this.mediosCultivoService.findOne(updateData.medioCultivoId)
      if (!medio) {
        throw new NotFoundException(`Medio de cultivo con ID ${updateData.medioCultivoId} no encontrado`)
      }
    }

    if (variedadIds) {
      const variedades = await Promise.all(
        variedadIds.map(vId => this.variedadService.findOne(vId))
      )
      cultivo.variedades = variedades
    }

    Object.assign(cultivo, updateData)
    return await this.cultivoRepo.save(cultivo)
  }

  async remove(id: number): Promise<void> {
    const cultivo = await this.findOne(id)
    await this.cultivoRepo.remove(cultivo)
  }

  async updatePlantCount(id: number, increment: number): Promise<void> {
    const cultivo = await this.findOne(id)
    await this.cultivoRepo.update(id, {
      cantidad_plantas: Math.max(0, (cultivo.cantidad_plantas || 0) + increment)
    })
  }

  async transicionarFase(cultivoId: number, dto: CambiarFaseDto): Promise<Cultivo> {
    const { nuevaFaseId, notas } = dto
    const cultivo = await this.cultivoRepo.findOne({ where: { id: cultivoId } })
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${cultivoId} no encontrado`)
    }

    const nuevaFase = await this.fasesService.findOne(nuevaFaseId)

    await this.historialService.cerrarActivo(cultivoId)
    await this.historialService.crear({
      cultivoId,
      faseId: nuevaFaseId,
      fecha_inicio: new Date(),
      notas
    })

    // 3. Actualizar el cultivo
    cultivo.faseId = nuevaFaseId

    // Actualizar también el enum legacy por compatibilidad
    const slugToEstado: Record<string, any> = {
      'esqueje': 'esqueje',
      'vegetativo': 'vegetativo',
      'floracion': 'floracion',
      'cosecha': 'cosecha',
      'finalizado': 'finalizado'
    }
    if (slugToEstado[nuevaFase.slug]) {
      cultivo.estado = slugToEstado[nuevaFase.slug]
    }

    await this.cultivoRepo.save(cultivo)

    return this.findOne(cultivoId)
  }
}
