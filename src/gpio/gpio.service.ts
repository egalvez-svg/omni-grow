import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LoggerService } from '../logger/logger.service'

import { CreateGpioDto } from './dto/create-gpio.dto'
import { UpdateGpioDto } from './dto/update-gpio.dto'
import { Gpio } from './entities/gpio.entity'

@Injectable()
export class GpioService {
  constructor(
    @InjectRepository(Gpio) private repo: Repository<Gpio>,
    private logger: LoggerService
  ) {
    this.logger.setContext('GpioService')
  }

  async create(createDto: CreateGpioDto): Promise<Gpio> {
    this.logger.log(`Creando GPIO pin ${createDto.pin} para dispositivo ${createDto.dispositivoId}`)

    const gpio = this.repo.create({
      ...createDto,
      dispositivo: { id: createDto.dispositivoId } as any
    })

    const saved = await this.repo.save(gpio)
    this.logger.log(`GPIO creado con ID: ${saved.id}`)
    return saved
  }

  async findAll(dispositivoId?: number): Promise<Gpio[]> {
    const where = dispositivoId ? { dispositivo: { id: dispositivoId } } : {}
    return this.repo.find({ where: where as any, relations: ['dispositivo', 'sensores', 'actuadores'] })
  }

  async findOne(id: number): Promise<Gpio> {
    const gpio = await this.repo.findOne({
      where: { id },
      relations: ['dispositivo', 'sensores', 'actuadores']
    })

    if (!gpio) {
      this.logger.error(`GPIO con ID ${id} no encontrado`)
      throw new NotFoundException(`GPIO con ID ${id} no encontrado`)
    }

    return gpio
  }

  async update(id: number, updateDto: UpdateGpioDto): Promise<Gpio> {
    const gpio = await this.findOne(id)
    this.logger.log(`Actualizando GPIO ID: ${id}`)

    if (updateDto.dispositivoId) {
      gpio.dispositivo = { id: updateDto.dispositivoId } as any
    }

    Object.assign(gpio, updateDto)
    const updated = await this.repo.save(gpio)

    this.logger.log(`GPIO ID ${id} actualizado`)
    return updated
  }

  async remove(id: number): Promise<void> {
    const gpio = await this.findOne(id)
    this.logger.log(`Eliminando GPIO ID: ${id}`)

    await this.repo.remove(gpio)
    this.logger.log(`GPIO ID ${id} eliminado`)
  }

  async registrarGpioDetectado(dispositivoId: number, pin: number, tipo: 'sensor' | 'actuador') {
    const existe = await this.repo.findOne({ where: { dispositivo: { id: dispositivoId }, pin } as any })
    if (existe) return existe

    const nuevo = this.repo.create({ dispositivo: { id: dispositivoId } as any, pin, tipo, activo: true })
    return this.repo.save(nuevo)
  }
}
