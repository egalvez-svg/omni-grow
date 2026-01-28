import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateVariedadDto } from './dto/create-variedad.dto'
import { UpdateVariedadDto } from './dto/update-variedad.dto'
import { Variedad } from './entities/variedad.entity'

@Injectable()
export class VariedadService {
  constructor(
    @InjectRepository(Variedad)
    private readonly variedadRepo: Repository<Variedad>
  ) {}

  async create(dto: CreateVariedadDto): Promise<Variedad> {
    const variedad = this.variedadRepo.create(dto)
    return await this.variedadRepo.save(variedad)
  }

  async findAll(): Promise<Variedad[]> {
    return await this.variedadRepo.find({ order: { nombre: 'ASC' } })
  }

  async findOne(id: number): Promise<Variedad> {
    const variedad = await this.variedadRepo.findOne({ where: { id } })
    if (!variedad) {
      throw new NotFoundException(`Variedad con ID ${id} no encontrada`)
    }
    return variedad
  }

  async update(id: number, dto: UpdateVariedadDto): Promise<Variedad> {
    await this.findOne(id)
    await this.variedadRepo.update(id, dto as any)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const variedad = await this.findOne(id)
    await this.variedadRepo.remove(variedad)
  }
}
