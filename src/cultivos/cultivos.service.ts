import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { Cama } from '../camas/entities/cama.entity'
import { Sala } from '../salas/entities/sala.entity'
import { Variedad } from '../variedad/entities/variedad.entity'
import { VariedadService } from '../variedad/variedad.service'
import { CreateCultivoDto } from './dto/create-cultivo.dto'
import { UpdateCultivoDto } from './dto/update-cultivo.dto'
import { Cultivo } from './entities/cultivo.entity'
import { MedioCultivo } from '../medios-cultivo/entities/medio-cultivo.entity'

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
    @InjectRepository(Sala)
    private readonly salaRepo: Repository<Sala>,
    @InjectRepository(Variedad)
    private readonly variedadRepo: Repository<Variedad>,
    @InjectRepository(MedioCultivo)
    private readonly medioCultivoRepo: Repository<MedioCultivo>,
    private readonly variedadService: VariedadService
  ) { }

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    const { variedadIds, ...cultivoData } = dto

    // Validar que la sala existe
    const sala = await this.salaRepo.findOne({ where: { id: dto.salaId } })
    if (!sala) {
      throw new NotFoundException(`Sala con ID ${dto.salaId} no encontrada`)
    }

    // Validar y obtener las variedades
    const variedades = await this.variedadRepo.find({
      where: { id: In(variedadIds) }
    })
    if (variedades.length !== variedadIds.length) {
      throw new NotFoundException('Una o más variedades no fueron encontradas')
    }

    // Validar medio de cultivo si se proporciona
    if (dto.medioCultivoId) {
      const medio = await this.medioCultivoRepo.findOne({ where: { id: dto.medioCultivoId } })
      if (!medio) {
        throw new NotFoundException(`Medio de cultivo con ID ${dto.medioCultivoId} no encontrado`)
      }
    }

    const cultivo: Cultivo = this.cultivoRepo.create({
      ...cultivoData,
      variedades
    })
    return await this.cultivoRepo.save(cultivo)
  }

  async findAll(): Promise<Cultivo[]> {
    return await this.cultivoRepo.find({
      relations: ['sala', 'cama', 'variedades', 'plantas', 'nutricionSemanal', 'medioCultivo'],
      order: { creado_en: 'DESC' }
    })
  }

  async findActivos(): Promise<Cultivo[]> {
    return await this.cultivoRepo.find({
      where: [{ estado: 'vegetativo' }, { estado: 'floracion' }, { estado: 'cosecha' }, { estado: 'esqueje' }],
      relations: ['sala', 'cama', 'variedades', 'plantas', 'nutricionSemanal', 'medioCultivo'],
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
        'medioCultivo'
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
      const sala = await this.salaRepo.findOne({ where: { id: updateData.salaId } })
      if (!sala) {
        throw new NotFoundException(`Sala con ID ${updateData.salaId} no encontrada`)
      }
    }

    if (updateData.camaId && updateData.camaId !== cultivo.camaId) {
      const cama = await this.salaRepo.manager.getRepository(Cama).findOne({ where: { id: updateData.camaId } })
      if (!cama) {
        throw new NotFoundException(`Cama con ID ${updateData.camaId} no encontrada`)
      }
    }

    if (updateData.medioCultivoId && updateData.medioCultivoId !== cultivo.medioCultivoId) {
      const medio = await this.medioCultivoRepo.findOne({ where: { id: updateData.medioCultivoId } })
      if (!medio) {
        throw new NotFoundException(`Medio de cultivo con ID ${updateData.medioCultivoId} no encontrado`)
      }
    }

    if (variedadIds) {
      const variedades = await this.variedadRepo.find({
        where: { id: In(variedadIds) }
      })
      if (variedades.length !== variedadIds.length) {
        throw new NotFoundException('Una o más variedades no fueron encontradas')
      }
      cultivo.variedades = variedades
    }

    Object.assign(cultivo, updateData)
    return await this.cultivoRepo.save(cultivo)
  }

  async remove(id: number): Promise<void> {
    const cultivo = await this.findOne(id)
    await this.cultivoRepo.remove(cultivo)
  }

  // Métodos auxiliares para otros módulos si es necesario (ej. para actualizar contador de plantas)
  async updatePlantCount(id: number, increment: number): Promise<void> {
    const cultivo = await this.findOne(id)
    await this.cultivoRepo.update(id, {
      cantidad_plantas: Math.max(0, (cultivo.cantidad_plantas || 0) + increment)
    })
  }
}
