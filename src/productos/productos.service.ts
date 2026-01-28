import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateProductoNutricionDto } from './dto/create-producto-nutricion.dto'
import { UpdateProductoNutricionDto } from './dto/update-producto-nutricion.dto'
import { ProductoNutricion } from './entities/producto-nutricion.entity'

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoNutricion)
    private readonly productoRepo: Repository<ProductoNutricion>
  ) {}

  async create(dto: CreateProductoNutricionDto): Promise<ProductoNutricion> {
    const producto = this.productoRepo.create(dto)
    return await this.productoRepo.save(producto)
  }

  async findAll(soloActivos = false): Promise<ProductoNutricion[]> {
    const where = soloActivos ? { activo: true } : {}
    return await this.productoRepo.find({ where, order: { nombre: 'ASC' } })
  }

  async findOne(id: number): Promise<ProductoNutricion> {
    const producto = await this.productoRepo.findOne({ where: { id } })
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }
    return producto
  }

  async update(id: number, dto: UpdateProductoNutricionDto): Promise<ProductoNutricion> {
    await this.findOne(id)
    await this.productoRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id)
    await this.productoRepo.remove(producto)
  }
}
