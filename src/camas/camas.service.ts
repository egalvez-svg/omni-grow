import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Sala } from '../salas/entities/sala.entity'
import { CreateCamaDto } from './dto/create-cama.dto'
import { UpdateCamaDto } from './dto/update-cama.dto'
import { Cama } from './entities/cama.entity'

@Injectable()
export class CamasService {
  constructor(
    @InjectRepository(Cama)
    private readonly camaRepo: Repository<Cama>,
    @InjectRepository(Sala)
    private readonly salaRepo: Repository<Sala>
  ) { }

  async create(dto: CreateCamaDto): Promise<Cama> {
    const sala = await this.salaRepo.findOne({ where: { id: dto.salaId } })
    if (!sala) {
      throw new NotFoundException(`Sala con ID ${dto.salaId} no encontrada`)
    }
    const cama = this.camaRepo.create(dto)
    return await this.camaRepo.save(cama)
  }

  async findAllBySala(salaId: number): Promise<Cama[]> {
    return await this.camaRepo.find({
      where: { salaId },
      relations: ['cultivos', 'cultivos.variedades']
    })
  }

  async findOne(id: number): Promise<Cama> {
    const cama = await this.camaRepo.findOne({
      where: { id },
      relations: ['sala', 'sala.dispositivos', 'sala.dispositivos.gpios.sensores',
        'sala.dispositivos.gpios.actuadores',
        'cultivos', 'cultivos.variedades']
    })
    if (!cama) {
      throw new NotFoundException(`Cama con ID ${id} no encontrada`)
    }
    return cama
  }

  async update(id: number, dto: UpdateCamaDto): Promise<Cama> {
    await this.findOne(id)
    await this.camaRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const cama = await this.findOne(id)
    await this.camaRepo.remove(cama)
  }
}
