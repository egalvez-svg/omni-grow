import { ApiProperty } from '@nestjs/swagger'
import { Dispositivo } from '../entities/dispositivo.entity'

export class SensorReadingDto {
  @ApiProperty({ description: 'ID del sensor' })
  sensorId: number

  @ApiProperty({ description: 'Tipo de sensor', example: 'temperatura' })
  tipo: string

  @ApiProperty({ description: 'Valor de la lectura', example: 24.5 })
  valor: number

  @ApiProperty({ description: 'Unidad de medida', example: '°C' })
  unidad: string

  @ApiProperty({ description: 'Timestamp de la lectura' })
  timestamp: Date

  @ApiProperty({ description: 'Valor mínimo registrado (24h)', example: 18.5 })
  min: number

  @ApiProperty({ description: 'Valor máximo registrado (24h)', example: 28.2 })
  max: number

  @ApiProperty({ description: 'Estado del sensor', example: 'activo' })
  estado: string
}

export class HistoricalDataPointDto {
  @ApiProperty({ description: 'Timestamp del punto de datos' })
  timestamp: Date

  @ApiProperty({ description: 'Valor de la lectura' })
  valor: number
}

export class SensorHistoricalDataDto {
  @ApiProperty({ description: 'ID del sensor' })
  sensorId: number

  @ApiProperty({ description: 'Tipo de sensor' })
  tipo: string

  @ApiProperty({ description: 'Unidad de medida' })
  unidad: string

  @ApiProperty({ description: 'Serie temporal de datos', type: [HistoricalDataPointDto] })
  datos: HistoricalDataPointDto[]
}

export class DeviceSensorDataDto {
  @ApiProperty({ description: 'ID del dispositivo' })
  dispositivoId: number

  @ApiProperty({ description: 'Nombre del dispositivo' })
  nombre: string

  @ApiProperty({ description: 'Lecturas actuales de sensores', type: [SensorReadingDto] })
  lecturas: SensorReadingDto[]

  @ApiProperty({ description: 'Última actualización' })
  ultimaActualizacion: Date
}

export class DeviceHistoricalDataDto {
  @ApiProperty({ description: 'ID del dispositivo' })
  dispositivoId: number

  @ApiProperty({ description: 'Nombre del dispositivo' })
  nombre: string

  @ApiProperty({ description: 'Datos históricos por sensor', type: [SensorHistoricalDataDto] })
  sensores: SensorHistoricalDataDto[]

  @ApiProperty({ description: 'Rango de tiempo en horas' })
  rangoHoras: number
}

export class DeviceWithReadingsDto {
  @ApiProperty({ description: 'Información del dispositivo' })
  dispositivo: Dispositivo

  @ApiProperty({ description: 'Lecturas actuales de sensores', type: [SensorReadingDto] })
  lecturasActuales: SensorReadingDto[]

  @ApiProperty({ description: 'Última actualización de lecturas' })
  ultimaActualizacion: Date
}
