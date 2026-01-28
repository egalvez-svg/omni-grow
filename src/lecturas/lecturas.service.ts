import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Between, Repository } from 'typeorm'

import { LoggerService } from '../logger/logger.service'

import { CreateLecturaDto } from './dto/create-lectura.dto'
import { Lectura } from './entities/lectura.entity'

@Injectable()
export class LecturasService {
  constructor(
    @InjectRepository(Lectura) private repo: Repository<Lectura>,
    private logger: LoggerService
  ) {
    this.logger.setContext('LecturasService')
  }

  async create(createDto: CreateLecturaDto): Promise<Lectura> {
    this.logger.log(`Registrando lectura para sensor ${createDto.sensorId}: ${createDto.valor}`)

    const lectura = this.repo.create({
      sensor: { id: createDto.sensorId } as any,
      valor: createDto.valor
    })

    const saved = await this.repo.save(lectura)
    this.logger.log(`Lectura registrada con ID: ${saved.id}`)
    return saved
  }

  async findAll(sensorId?: number, fechaInicio?: Date, fechaFin?: Date): Promise<Lectura[]> {
    const where: any = {}

    if (sensorId) {
      where.sensor = { id: sensorId }
    }

    if (fechaInicio && fechaFin) {
      where.registrado_en = Between(fechaInicio, fechaFin)
    }

    return this.repo.find({
      where,
      relations: ['sensor'],
      order: { registrado_en: 'DESC' },
      take: 100 // Limitar a 100 registros por defecto
    })
  }

  async findOne(id: number): Promise<Lectura> {
    const lectura = await this.repo.findOne({
      where: { id },
      relations: ['sensor']
    })

    if (!lectura) {
      this.logger.error(`Lectura con ID ${id} no encontrada`)
      throw new NotFoundException(`Lectura con ID ${id} no encontrada`)
    }

    return lectura
  }

  async findBySensor(sensorId: number, limit: number = 50): Promise<Lectura[]> {
    return this.repo.find({
      where: { sensor: { id: sensorId } as any },
      order: { registrado_en: 'DESC' },
      take: limit
    })
  }

  async obtenerUltimaLectura(sensorId: number): Promise<Lectura | null> {
    return this.repo.findOne({
      where: { sensor: { id: sensorId } as any },
      order: { registrado_en: 'DESC' }
    })
  }

  async registrarLectura(sensorId: number, valor: number): Promise<Lectura> {
    return this.create({ sensorId, valor })
  }

  async obtenerEstadisticas(sensorId: number, horasAtras: number = 24): Promise<{ min: number; max: number }> {
    const fechaInicio = new Date(Date.now() - horasAtras * 60 * 60 * 1000)

    const lecturas = await this.repo.find({
      where: {
        sensor: { id: sensorId } as any,
        registrado_en: Between(fechaInicio, new Date())
      },
      order: { registrado_en: 'DESC' }
    })

    if (lecturas.length === 0) {
      return { min: 0, max: 0 }
    }

    const valores = lecturas.map(l => Number(l.valor))
    return {
      min: Math.min(...valores),
      max: Math.max(...valores)
    }
  }

  async findRecentReadingsBySala(salaId: number, start: Date, end: Date): Promise<Lectura[]> {
    return await this.repo
      .createQueryBuilder('lectura')
      .leftJoinAndSelect('lectura.sensor', 'sensor')
      .leftJoinAndSelect('sensor.gpio', 'gpio')
      .leftJoinAndSelect('gpio.dispositivo', 'dispositivo')
      .where('dispositivo.salaId = :salaId', { salaId })
      .andWhere('lectura.registrado_en BETWEEN :start AND :end', { start, end })
      .getMany()
  }
}
