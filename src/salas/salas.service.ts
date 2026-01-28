import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Dispositivo } from '../dispositivos/entities/dispositivo.entity'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'
import { Sala } from './entities/sala.entity'

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepo: Repository<Sala>,
    @InjectRepository(Dispositivo)
    private readonly dispositivoRepo: Repository<Dispositivo>
  ) {}

  // ==================== SALAS ====================

  async create(dto: CreateSalaDto, usuarioId: number): Promise<Sala> {
    const { dispositivoIds, ...salaData } = dto
    const sala = this.salaRepo.create({ ...salaData, usuarioId })
    const savedSala = await this.salaRepo.save(sala)

    if (dispositivoIds && dispositivoIds.length > 0) {
      await this.dispositivoRepo.update(dispositivoIds, { salaId: savedSala.id })
    }

    return await this.findOne(savedSala.id)
  }

  async findAll(): Promise<Sala[]> {
    return await this.salaRepo.find({ relations: ['dispositivos', 'camas', 'cultivos'] })
  }

  async findByUser(usuarioId: number): Promise<Sala[]> {
    return await this.salaRepo.find({
      where: { usuarioId },
      relations: ['dispositivos', 'camas', 'cultivos']
    })
  }

  async findOne(id: number): Promise<Sala> {
    const sala = await this.salaRepo.findOne({
      where: { id },
      relations: [
        'dispositivos',
        'camas',
        'cultivos',
        'dispositivos.gpios',
        'dispositivos.reglas',
        'cultivos.variedades'
      ]
    })
    if (!sala) {
      throw new NotFoundException(`Sala con ID ${id} no encontrada`)
    }
    return sala
  }

  async update(id: number, dto: UpdateSalaDto): Promise<Sala> {
    const { dispositivoIds, ...updateData } = dto
    await this.findOne(id)

    if (Object.keys(updateData).length > 0) {
      await this.salaRepo.update(id, updateData)
    }

    if (dispositivoIds !== undefined) {
      // Primero desvincular dispositivos que estaban en esta sala y ya no están en la lista
      // (Comportamiento de sincronización)
      await this.dispositivoRepo.update({ salaId: id }, { salaId: null as any })

      if (dispositivoIds.length > 0) {
        await this.dispositivoRepo.update(dispositivoIds, { salaId: id })
      }
    }

    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const sala = await this.findOne(id)
    await this.salaRepo.remove(sala)
  }
}
