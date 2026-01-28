import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LoggerService } from '../logger/logger.service'
import { MqttService } from '../mqtt/mqtt.service'

import { CreateActuadorDto } from './dto/create-actuador.dto'
import { UpdateActuadorDto } from './dto/update-actuador.dto'
import { Actuador } from './entities/actuador.entity'

@Injectable()
export class ActuadoresService {
  constructor(
    @InjectRepository(Actuador) private repo: Repository<Actuador>,
    private mqttService: MqttService,
    private logger: LoggerService
  ) {
    this.logger.setContext('ActuadoresService')
  }

  async create(createDto: CreateActuadorDto): Promise<Actuador> {
    this.logger.log(`Creando actuador tipo ${createDto.tipo}`)

    const actuador = this.repo.create({
      ...createDto,
      gpio: { id: createDto.gpioId } as any
    })

    const saved = await this.repo.save(actuador)
    this.logger.log(`Actuador creado con ID: ${saved.id}`)
    return saved
  }

  async findAll(): Promise<Actuador[]> {
    return this.repo.find({ relations: ['gpio'] })
  }

  async findOne(id: number): Promise<Actuador> {
    const actuador = await this.repo.findOne({
      where: { id },
      relations: ['gpio']
    })

    if (!actuador) {
      this.logger.error(`Actuador con ID ${id} no encontrado`)
      throw new NotFoundException(`Actuador con ID ${id} no encontrado`)
    }

    return actuador
  }

  async update(id: number, updateDto: UpdateActuadorDto): Promise<Actuador> {
    const actuador = await this.findOne(id)
    this.logger.log(`Actualizando actuador ID: ${id}`)

    if (updateDto.gpioId) {
      actuador.gpio = { id: updateDto.gpioId } as any
    }

    Object.assign(actuador, updateDto)
    const updated = await this.repo.save(actuador)

    this.logger.log(`Actuador ID ${id} actualizado`)
    return updated
  }

  async remove(id: number): Promise<void> {
    const actuador = await this.findOne(id)
    this.logger.log(`Eliminando actuador ID: ${id}`)

    await this.repo.remove(actuador)
    this.logger.log(`Actuador ID ${id} eliminado`)
  }

  async ejecutarAccion(actuadorId: number, accion: 'encender' | 'apagar') {
    const actuador = await this.findOne(actuadorId)

    const nuevoEstado = accion === 'encender'

    if (actuador.estado === nuevoEstado) {
      this.logger.log(
        `Actuador ${actuadorId} ya está ${accion === 'encender' ? 'encendido' : 'apagado'}. Sin cambios necesarios.`
      )
      return { ok: true, skipped: true, estado: actuador.estado, reason: 'already_in_state' }
    }

    const topic = `clima/actuador/${actuador.id}/set`
    const payload = { accion, timestamp: new Date().toISOString() }

    this.logger.log(`Publicando acción '${accion}' para actuador ${actuadorId} en topic '${topic}'`)

    try {
      await this.mqttService.publish(topic, payload)
      this.logger.log(`Acción '${accion}' publicada exitosamente para actuador ${actuadorId}`)

      actuador.estado = nuevoEstado
      await this.repo.save(actuador)
      this.logger.log(`Estado del actuador ${actuadorId} actualizado a: ${nuevoEstado}`)
    } catch (error) {
      this.logger.error(`Error publicando acción: ${error.message}`, error.stack)
      throw error
    }

    return { ok: true, topic, payload, estado: nuevoEstado }
  }
}
