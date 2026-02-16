import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FaseCultivo } from './entities/fase-cultivo.entity'

@Injectable()
export class FasesService {
    constructor(
        @InjectRepository(FaseCultivo)
        private readonly faseRepo: Repository<FaseCultivo>
    ) { }

    async findOne(id: number): Promise<FaseCultivo> {
        const fase = await this.faseRepo.findOne({ where: { id } })
        if (!fase) {
            throw new NotFoundException(`Fase con ID ${id} no encontrada`)
        }
        return fase
    }

    async findBySlug(slug: string): Promise<FaseCultivo | null> {
        return await this.faseRepo.findOne({ where: { slug } })
    }

    async findAll(): Promise<FaseCultivo[]> {
        return await this.faseRepo.find({ where: { activo: true } })
    }
}
