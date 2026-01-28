import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LoggerService } from '../logger/logger.service'

import { LecturasService } from '../lecturas/lecturas.service'
import { CreateDispositivoDto } from './dto/create-dispositivo.dto'
import { DeviceHistoricalDataDto, DeviceSensorDataDto, SensorHistoricalDataDto } from './dto/sensor-reading.dto'
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto'
import { Dispositivo } from './entities/dispositivo.entity'

@Injectable()
export class DispositivosService {
  constructor(
    @InjectRepository(Dispositivo) private repo: Repository<Dispositivo>,
    private logger: LoggerService,
    private lecturasService: LecturasService
  ) {
    this.logger.setContext('DispositivosService')
  }

  async create(createDto: CreateDispositivoDto, usuarioId: number): Promise<Dispositivo> {
    this.logger.log(`Creando dispositivo: ${createDto.nombre} para usuario ID: ${usuarioId}`)
    const dispositivo = this.repo.create({
      ...createDto,
      usuarioId
    })
    const saved = await this.repo.save(dispositivo)
    this.logger.log(`Dispositivo creado con ID: ${saved.id}`)
    return saved
  }

  async findAll(): Promise<Dispositivo[]> {
    return this.repo.find({ relations: ['gpios', 'usuario'] })
  }

  async findOne(id: number, horas: number = 24): Promise<any> {
    const dispositivo = await this.repo.findOne({
      where: { id },
      relations: [
        'gpios',
        'usuario',
        'gpios.sensores',
        'gpios.actuadores',
        'reglas',
        'reglas.sensor',
        'reglas.actuador',
        'sala'
      ]
    })

    if (!dispositivo) {
      this.logger.error(`Dispositivo con ID ${id} no encontrado`)
      throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`)
    }

    const sensores = dispositivo.gpios?.flatMap(gpio => gpio.sensores || []) || []

    const lecturasActuales = await Promise.all(
      sensores.map(async sensor => {
        const lectura = await this.lecturasService.obtenerUltimaLectura(sensor.id)
        const stats = await this.lecturasService.obtenerEstadisticas(sensor.id, horas)
        return {
          sensorId: sensor.id,
          tipo: sensor.tipo,
          valor: lectura?.valor || 0,
          unidad: sensor.unidad,
          timestamp: lectura?.registrado_en || new Date(),
          min: stats.min,
          max: stats.max,
          estado: lectura ? 'activo' : 'sin_datos'
        }
      })
    )

    return {
      ...dispositivo,
      lecturasActuales,
      ultimaActualizacion: new Date()
    }
  }

  async update(id: number, updateDto: UpdateDispositivoDto): Promise<Dispositivo> {
    const dispositivo = await this.findOne(id)
    this.logger.log(`Actualizando dispositivo ID: ${id}`)

    Object.assign(dispositivo, updateDto)
    const updated = await this.repo.save(dispositivo)

    this.logger.log(`Dispositivo ID ${id} actualizado`)
    return updated
  }

  async remove(id: number): Promise<void> {
    const dispositivo = await this.findOne(id)
    this.logger.log(`Eliminando dispositivo ID: ${id}`)

    await this.repo.remove(dispositivo)
    this.logger.log(`Dispositivo ID ${id} eliminado`)
  }

  async findByUser(id: number): Promise<any[]> {
    const dispositivos = await this.repo.find({
      where: { usuarioId: id },
      relations: ['gpios', 'usuario', 'gpios.sensores', 'gpios.actuadores', 'sala']
    })

    if (!dispositivos.length) {
      this.logger.error(`No existen dispositivos asociados al usuario ${id}`)
      throw new NotFoundException(`No existen dispositivos asociados al usuario ${id}`)
    }

    const dispositivosConLecturas = await Promise.all(
      dispositivos.map(async dispositivo => {
        const sensores = dispositivo.gpios?.flatMap(gpio => gpio.sensores || []) || []

        const lecturasActuales = await Promise.all(
          sensores.map(async sensor => {
            const lectura = await this.lecturasService.obtenerUltimaLectura(sensor.id)
            const stats = await this.lecturasService.obtenerEstadisticas(sensor.id, 24)
            return {
              sensorId: sensor.id,
              tipo: sensor.tipo,
              valor: lectura?.valor || 0,
              unidad: sensor.unidad,
              timestamp: lectura?.registrado_en || new Date(),
              min: stats.min,
              max: stats.max,
              estado: lectura ? 'activo' : 'sin_datos'
            }
          })
        )

        return {
          ...dispositivo,
          lecturasActuales,
          ultimaActualizacion: new Date()
        }
      })
    )

    return dispositivosConLecturas
  }

  async obtenerLecturasActuales(dispositivoId: number): Promise<DeviceSensorDataDto> {
    const dispositivo = await this.repo.findOne({
      where: { id: dispositivoId },
      relations: ['gpios', 'gpios.sensores']
    })

    if (!dispositivo) {
      this.logger.error(`Dispositivo con ID ${dispositivoId} no encontrado`)
      throw new NotFoundException(`Dispositivo con ID ${dispositivoId} no encontrado`)
    }

    const sensores = dispositivo.gpios?.flatMap(gpio => gpio.sensores || []) || []

    if (sensores.length === 0) {
      this.logger.warn(`Dispositivo ${dispositivoId} no tiene sensores configurados`)
    }
    const lecturas = await Promise.all(
      sensores.map(async sensor => {
        const lectura = await this.lecturasService.obtenerUltimaLectura(sensor.id)
        const stats = await this.lecturasService.obtenerEstadisticas(sensor.id, 24)
        return {
          sensorId: sensor.id,
          tipo: sensor.tipo,
          valor: lectura?.valor || 0,
          unidad: sensor.unidad,
          timestamp: lectura?.registrado_en || new Date(),
          min: stats.min,
          max: stats.max,
          estado: lectura ? 'activo' : 'sin_datos'
        }
      })
    )

    return {
      dispositivoId: dispositivo.id,
      nombre: dispositivo.nombre,
      lecturas,
      ultimaActualizacion: new Date()
    }
  }

  async obtenerLecturasHistoricas(dispositivoId: number, horasAtras: number = 24): Promise<DeviceHistoricalDataDto> {
    const dispositivo = await this.repo.findOne({
      where: { id: dispositivoId },
      relations: ['gpios', 'gpios.sensores']
    })
    if (!dispositivo) {
      this.logger.error(`Dispositivo con ID ${dispositivoId} no encontrado`)
      throw new NotFoundException(`Dispositivo con ID ${dispositivoId} no encontrado`)
    }

    const sensores = dispositivo.gpios?.flatMap(gpio => gpio.sensores || []) || []

    if (sensores.length === 0) {
      this.logger.warn(`Dispositivo ${dispositivoId} no tiene sensores configurados`)
    }

    const fechaInicio = new Date(Date.now() - horasAtras * 60 * 60 * 1000)
    const fechaFin = new Date()

    const datosHistoricos: SensorHistoricalDataDto[] = await Promise.all(
      sensores.map(async sensor => {
        const lecturas = await this.lecturasService.findBySensor(sensor.id, 1000)
        const lecturasFiltradas = lecturas.filter(l => l.registrado_en >= fechaInicio && l.registrado_en <= fechaFin)
        return {
          sensorId: sensor.id,
          tipo: sensor.tipo,
          unidad: sensor.unidad,
          datos: lecturasFiltradas.map(l => ({
            timestamp: l.registrado_en,
            valor: Number(l.valor)
          }))
        }
      })
    )

    return {
      dispositivoId: dispositivo.id,
      nombre: dispositivo.nombre,
      sensores: datosHistoricos,
      rangoHoras: horasAtras
    }
  }
}
