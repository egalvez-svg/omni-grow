import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Cultivo } from '../cultivos/entities/cultivo.entity'
import { ProductosService } from '../productos/productos.service'
import { CreateNutricionSemanalDto } from './dto/create-nutricion-semanal.dto'
import { UpdateNutricionSemanalDto } from './dto/update-nutricion-semanal.dto'
import { NutricionSemanal } from './entities/nutricion-semanal.entity'
import { ProductoRiego } from './entities/producto-riego.entity'

@Injectable()
export class NutricionService {
  constructor(
    @InjectRepository(NutricionSemanal)
    private readonly nutricionSemanalRepo: Repository<NutricionSemanal>,
    @InjectRepository(ProductoRiego)
    private readonly productoRiegoRepo: Repository<ProductoRiego>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
    private readonly productosService: ProductosService
  ) {}

  async addNutricionSemanal(cultivoId: number, dto: CreateNutricionSemanalDto): Promise<NutricionSemanal> {
    // Validar que el cultivo existe
    const cultivo = await this.cultivoRepo.findOne({ where: { id: cultivoId } })
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${cultivoId} no encontrado`)
    }

    // Validar que todos los productos existen
    if (dto.productos) {
      for (const producto of dto.productos) {
        await this.productosService.findOne(producto.productoNutricionId)
      }
    }

    let semana = dto.semana
    if (semana === undefined || semana === null) {
      // Calcular semana basada en la fecha de inicio del cultivo
      const fechaInicio = new Date(cultivo.fecha_inicio)
      const fechaAplicacion = new Date(dto.fecha_aplicacion)
      const diffTime = Math.abs(fechaAplicacion.getTime() - fechaInicio.getTime())
      semana = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1
    }

    const nutricion = this.nutricionSemanalRepo.create({
      cultivoId,
      semana: semana,
      fecha_aplicacion: dto.fecha_aplicacion,
      litros_agua: dto.litros_agua,
      ph: dto.ph,
      ec: dto.ec,
      tipo_riego: dto.tipo_riego ?? 'nutricion',
      notas: dto.notas
    })

    const savedNutricion = await this.nutricionSemanalRepo.save(nutricion)

    // Crear registros de productos si existen
    if (dto.productos && dto.productos.length > 0) {
      const productosRiego = dto.productos.map(p =>
        this.productoRiegoRepo.create({
          nutricionSemanalId: savedNutricion.id,
          productoNutricionId: p.productoNutricionId,
          dosis_por_litro: p.dosis_por_litro
        })
      )
      await this.productoRiegoRepo.save(productosRiego)
    }

    const nutricionConProductos = await this.nutricionSemanalRepo.findOne({
      where: { id: savedNutricion.id },
      relations: ['productos', 'productos.productoNutricion']
    })

    if (!nutricionConProductos) {
      throw new NotFoundException(`Registro de nutrición no encontrado después de crear`)
    }

    return nutricionConProductos
  }

  async findByCultivo(cultivoId: number): Promise<NutricionSemanal[]> {
    return await this.nutricionSemanalRepo.find({
      where: { cultivoId },
      relations: ['productos', 'productos.productoNutricion'],
      order: { semana: 'ASC' }
    })
  }

  async findBySemana(cultivoId: number, semana: number): Promise<NutricionSemanal[]> {
    return await this.nutricionSemanalRepo.find({
      where: { cultivoId, semana },
      relations: ['productos', 'productos.productoNutricion'],
      order: { fecha_aplicacion: 'DESC' }
    })
  }

  async findOne(id: number): Promise<NutricionSemanal> {
    const nutricion = await this.nutricionSemanalRepo.findOne({
      where: { id },
      relations: ['productos', 'productos.productoNutricion']
    })
    if (!nutricion) {
      throw new NotFoundException(`Registro de nutrición con ID ${id} no encontrado`)
    }
    return nutricion
  }

  async update(cultivoId: number, nutricionId: number, dto: UpdateNutricionSemanalDto): Promise<NutricionSemanal> {
    const nutricion = await this.nutricionSemanalRepo.findOne({ where: { id: nutricionId, cultivoId } })
    if (!nutricion) {
      throw new NotFoundException(`Registro de nutrición con ID ${nutricionId} no encontrado en este cultivo`)
    }

    // Si se actualizan los productos, eliminar los anteriores y crear nuevos
    if (dto.productos && dto.productos.length > 0) {
      // Validar que todos los productos existen
      for (const producto of dto.productos) {
        await this.productosService.findOne(producto.productoNutricionId)
      }

      await this.productoRiegoRepo.delete({ nutricionSemanalId: nutricionId })

      const productosRiego = dto.productos.map(p =>
        this.productoRiegoRepo.create({
          nutricionSemanalId: nutricionId,
          productoNutricionId: p.productoNutricionId,
          dosis_por_litro: p.dosis_por_litro
        })
      )

      await this.productoRiegoRepo.save(productosRiego)
    }

    const { productos, ...updateData } = dto
    await this.nutricionSemanalRepo.update(nutricionId, updateData)

    return this.findOne(nutricionId)
  }

  async remove(cultivoId: number, nutricionId: number): Promise<void> {
    const nutricion = await this.nutricionSemanalRepo.findOne({ where: { id: nutricionId, cultivoId } })
    if (!nutricion) {
      throw new NotFoundException(`Registro de nutrición con ID ${nutricionId} no encontrado en este cultivo`)
    }

    await this.nutricionSemanalRepo.remove(nutricion)
  }
}
