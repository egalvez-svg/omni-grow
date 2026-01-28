import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MedioCultivo } from './entities/medio-cultivo.entity'
import { CreateMedioCultivoDto } from './dto/create-medio-cultivo.dto'
import { UpdateMedioCultivoDto } from './dto/update-medio-cultivo.dto'

@Injectable()
export class MediosCultivoService {
    constructor(
        @InjectRepository(MedioCultivo)
        private readonly medioCultivoRepository: Repository<MedioCultivo>
    ) { }

    async create(createMedioCultivoDto: CreateMedioCultivoDto): Promise<MedioCultivo> {
        const nuevo = this.medioCultivoRepository.create(createMedioCultivoDto)
        return await this.medioCultivoRepository.save(nuevo)
    }

    async findAll(): Promise<MedioCultivo[]> {
        return this.medioCultivoRepository.find()
    }

    async findOne(id: number): Promise<MedioCultivo | null> {
        return this.medioCultivoRepository.findOneBy({ id })
    }

    async update(id: number, updateMedioCultivoDto: UpdateMedioCultivoDto): Promise<MedioCultivo> {
        const medio = await this.findOne(id)
        if (!medio) {
            throw new NotFoundException(`Medio de cultivo #${id} no encontrado`)
        }

        Object.assign(medio, updateMedioCultivoDto)
        return await this.medioCultivoRepository.save(medio)
    }

    async remove(id: number): Promise<void> {
        const medio = await this.findOne(id)
        if (!medio) {
            throw new NotFoundException(`Medio de cultivo #${id} no encontrado`)
        }

        await this.medioCultivoRepository.remove(medio)
    }
}
