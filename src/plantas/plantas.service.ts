import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Cultivo } from '../cultivos/entities/cultivo.entity'
import { VariedadService } from '../variedad/variedad.service'
import { CreatePlantaPosicionDto } from './dto/create-planta-posicion.dto'
import { UpdatePlantaPosicionDto } from './dto/update-planta-posicion.dto'
import { PlantaPosicion } from './entities/planta-posicion.entity'

@Injectable()
export class PlantasService {
  constructor(
    @InjectRepository(PlantaPosicion)
    private readonly plantaRepo: Repository<PlantaPosicion>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
    private readonly variedadService: VariedadService
  ) {}

  async create(cultivoId: number, dto: CreatePlantaPosicionDto): Promise<PlantaPosicion> {
    const cultivo = await this.cultivoRepo.findOne({
      where: { id: cultivoId },
      relations: ['cama']
    })
    if (!cultivo) {
      throw new NotFoundException(`Cultivo con ID ${cultivoId} no encontrado`)
    }

    // Validar dimensiones si hay una cama asignada
    if (cultivo.cama) {
      if (dto.fila > cultivo.cama.filas || dto.columna > cultivo.cama.columnas) {
        throw new BadRequestException(
          `Posición (${dto.fila}, ${dto.columna}) fuera de los límites de la cama ` +
            `(${cultivo.cama.filas}x${cultivo.cama.columnas})`
        )
      }
    }

    // Validar duplicados en el mismo cultivo
    const existing = await this.plantaRepo.findOne({
      where: { cultivoId, fila: dto.fila, columna: dto.columna, estado: 'activa' }
    })
    if (existing) {
      throw new BadRequestException(`La posición (${dto.fila}, ${dto.columna}) ya está ocupada`)
    }

    // Validar variedad si se proporciona
    if (dto.variedadId) {
      await this.variedadService.findOne(dto.variedadId)
    }

    const planta = this.plantaRepo.create({ ...dto, cultivoId })
    const saved = await this.plantaRepo.save(planta)

    // Actualizar contador
    await this.cultivoRepo.update(cultivoId, {
      cantidad_plantas: cultivo.cantidad_plantas + 1
    })

    return saved
  }

  async findAllByCultivo(cultivoId: number): Promise<PlantaPosicion[]> {
    return await this.plantaRepo.find({
      where: { cultivoId },
      order: { fila: 'ASC', columna: 'ASC' }
    })
  }

  async findOne(id: number): Promise<PlantaPosicion> {
    const planta = await this.plantaRepo.findOne({
      where: { id },
      relations: ['cultivo']
    })
    if (!planta) {
      throw new NotFoundException(`Planta con ID ${id} no encontrada`)
    }
    return planta
  }

  async update(id: number, dto: UpdatePlantaPosicionDto): Promise<PlantaPosicion> {
    const planta = await this.findOne(id)

    const finalFila = dto.fila ?? planta.fila
    const finalColumna = dto.columna ?? planta.columna

    if (dto.fila || dto.columna) {
      const cultivo = await this.cultivoRepo.findOne({
        where: { id: planta.cultivoId },
        relations: ['cama']
      })

      if (cultivo?.cama) {
        if (finalFila > cultivo.cama.filas || finalColumna > cultivo.cama.columnas) {
          throw new BadRequestException(
            `Nueva posición (${finalFila}, ${finalColumna}) fuera de límites ` +
              `(${cultivo.cama.filas}x${cultivo.cama.columnas})`
          )
        }
      }

      const existing = await this.plantaRepo.findOne({
        where: {
          cultivoId: planta.cultivoId,
          fila: finalFila,
          columna: finalColumna,
          estado: 'activa'
        }
      })
      if (existing && existing.id !== id) {
        throw new BadRequestException(`La posición (${finalFila}, ${finalColumna}) ya está ocupada`)
      }
    }

    await this.plantaRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const planta = await this.findOne(id)
    const cultivoId = planta.cultivoId

    await this.plantaRepo.remove(planta)

    // Actualizar contador
    const cultivo = await this.cultivoRepo.findOne({ where: { id: cultivoId } })
    if (cultivo) {
      await this.cultivoRepo.update(cultivoId, {
        cantidad_plantas: Math.max(0, cultivo.cantidad_plantas - 1)
      })
    }
  }
}
