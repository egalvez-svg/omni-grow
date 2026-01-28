import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LecturasService } from '../lecturas/lecturas.service'
import { LoggerService } from '../logger/logger.service'

import { CreateSensorDto } from './dto/create-sensor.dto'
import { UpdateSensorDto } from './dto/update-sensor.dto'
import { Sensor } from './entities/sensor.entity'

@Injectable()
export class SensoresService {
  constructor(
    @InjectRepository(Sensor) private repo: Repository<Sensor>,
    private lecturasService: LecturasService,
    private logger: LoggerService
  ) {
    this.logger.setContext('SensoresService')
  }

  async create(createDto: CreateSensorDto): Promise<Sensor> {
    this.logger.log(`Creando sensor tipo ${createDto.tipo}`)

    const sensor = this.repo.create({
      ...createDto,
      gpio: { id: createDto.gpioId } as any
    })

    const saved = await this.repo.save(sensor)
    this.logger.log(`Sensor creado con ID: ${saved.id}`)
    return saved
  }

  async findAll(): Promise<Sensor[]> {
    return this.repo.find({ relations: ['gpio'] })
  }

  async findOne(id: number): Promise<Sensor> {
    const sensor = await this.repo.findOne({
      where: { id },
      relations: ['gpio']
    })

    if (!sensor) {
      this.logger.error(`Sensor con ID ${id} no encontrado`)
      throw new NotFoundException(`Sensor con ID ${id} no encontrado`)
    }

    return sensor
  }

  async update(id: number, updateDto: UpdateSensorDto): Promise<Sensor> {
    const sensor = await this.findOne(id)
    this.logger.log(`Actualizando sensor ID: ${id}`)

    if (updateDto.gpioId) {
      sensor.gpio = { id: updateDto.gpioId } as any
    }

    Object.assign(sensor, updateDto)
    const updated = await this.repo.save(sensor)

    this.logger.log(`Sensor ID ${id} actualizado`)
    return updated
  }

  async remove(id: number): Promise<void> {
    const sensor = await this.findOne(id)
    this.logger.log(`Eliminando sensor ID: ${id}`)

    await this.repo.remove(sensor)
    this.logger.log(`Sensor ID ${id} eliminado`)
  }

  async obtenerUltimaLectura(sensorId: number) {
    return this.lecturasService.obtenerUltimaLectura(sensorId)
  }

  async findOneByDeviceAndType(deviceId: number, tipo: string): Promise<Sensor | null> {
    const sensors = await this.repo.find({
      where: {
        gpio: {
          dispositivo: { id: deviceId },
          activo: true
        },
        activo: true
      },
      relations: ['gpio', 'gpio.dispositivo']
    })

    return sensors.find(s => s.tipo.toLowerCase() === tipo.toLowerCase()) || null
  }

  async findByDevice(deviceId: number): Promise<Sensor[]> {
    return this.repo.find({
      where: {
        gpio: {
          dispositivo: { id: deviceId },
          activo: true
        },
        activo: true
      },
      relations: ['gpio', 'gpio.dispositivo']
    })
  }
}
