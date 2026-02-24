import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateControlPlagaDto } from './dto/create-control-plaga.dto'
import { UpdateControlPlagaDto } from './dto/update-control-plaga.dto'
import { ControlPlaga } from './entities/control-plaga.entity'
import { ProductoControlPlaga } from './entities/producto-control-plaga.entity'

@Injectable()
export class ControlPlagasService {
    constructor(
        @InjectRepository(ControlPlaga)
        private readonly controlPlagaRepo: Repository<ControlPlaga>,
        @InjectRepository(ProductoControlPlaga)
        private readonly productoControlPlagaRepo: Repository<ProductoControlPlaga>
    ) { }

    async create(dto: CreateControlPlagaDto): Promise<ControlPlaga> {
        const { productos, ...data } = dto

        const controlPlaga = this.controlPlagaRepo.create({
            ...data,
            productos: productos.map(p => this.productoControlPlagaRepo.create(p))
        })

        return await this.controlPlagaRepo.save(controlPlaga)
    }

    async findAll(cultivoId?: number): Promise<ControlPlaga[]> {
        const where = cultivoId ? { cultivoId } : {}
        return await this.controlPlagaRepo.find({
            where,
            relations: ['productos', 'productos.producto'],
            order: { fecha_aplicacion: 'DESC' }
        })
    }

    async findOne(id: number): Promise<ControlPlaga> {
        const controlPlaga = await this.controlPlagaRepo.findOne({
            where: { id },
            relations: ['productos', 'productos.producto']
        })
        if (!controlPlaga) {
            throw new NotFoundException(`Registro de control de plaga con ID ${id} no encontrado`)
        }
        return controlPlaga
    }

    async update(id: number, dto: UpdateControlPlagaDto): Promise<ControlPlaga> {
        const { productos, ...data } = dto
        const controlPlaga = await this.findOne(id)

        if (data) {
            Object.assign(controlPlaga, data)
        }

        if (productos) {
            // Simplificación: eliminamos los anteriores y creamos los nuevos
            await this.productoControlPlagaRepo.delete({ controlPlagaId: id })
            controlPlaga.productos = productos.map(p => this.productoControlPlagaRepo.create(p))
        }

        return await this.controlPlagaRepo.save(controlPlaga)
    }

    async remove(id: number): Promise<void> {
        const controlPlaga = await this.findOne(id)
        await this.controlPlagaRepo.remove(controlPlaga)
    }
}
