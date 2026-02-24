import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductoTipoDto } from './dto/create-producto-tipo.dto'
import { UpdateProductoTipoDto } from './dto/update-producto-tipo.dto'
import { ProductoTipo } from './entities/producto-tipo.entity'

@Injectable()
export class ProductosTiposService {
    constructor(
        @InjectRepository(ProductoTipo)
        private readonly repo: Repository<ProductoTipo>
    ) { }

    async create(dto: CreateProductoTipoDto): Promise<ProductoTipo> {
        const tipo = this.repo.create(dto)
        return await this.repo.save(tipo)
    }

    async findAll(): Promise<ProductoTipo[]> {
        return await this.repo.find({ order: { nombre: 'ASC' } })
    }

    async findOne(id: number): Promise<ProductoTipo> {
        const tipo = await this.repo.findOne({ where: { id } })
        if (!tipo) {
            throw new NotFoundException(`Tipo de producto con ID ${id} no encontrado`)
        }
        return tipo
    }

    async update(id: number, dto: UpdateProductoTipoDto): Promise<ProductoTipo> {
        await this.findOne(id)
        await this.repo.update(id, dto)
        return this.findOne(id)
    }

    async remove(id: number): Promise<void> {
        const tipo = await this.findOne(id)
        await this.repo.remove(tipo)
    }
}
