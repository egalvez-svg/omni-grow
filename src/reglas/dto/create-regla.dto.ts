import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min
} from 'class-validator'

export class CreateReglaDto {
  @ApiProperty({
    description: 'nombre',
    example: 'Regla 1',
    required: true
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string

  @ApiProperty({
    description: 'Tipo de regla',
    example: 'sensor',
    enum: ['sensor', 'horario'],
    required: true
  })
  @IsNotEmpty({ message: 'El tipo de regla es requerido' })
  @IsEnum(['sensor', 'horario'], {
    message: 'El tipo debe ser: sensor, horario'
  })
  tipo: 'sensor' | 'horario'

  // Campos para reglas basadas en sensores
  @ApiProperty({
    description: 'sensorId (requerido solo para tipo sensor)',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del sensor debe ser un número' })
  @IsInt({ message: 'El ID del sensor debe ser un entero' })
  sensorId?: number

  @ApiProperty({
    description: 'comparador (requerido solo para tipo sensor)',
    example: '>',
    enum: ['>', '<', '>=', '<=', '='],
    required: false
  })
  @IsOptional()
  @IsEnum(['>', '<', '>=', '<=', '='], {
    message: 'El comparador debe ser: >, <, >=, <=, ='
  })
  comparador?: '>' | '<' | '>=' | '<=' | '='

  @ApiProperty({
    description: 'valor_trigger (requerido solo para tipo sensor)',
    example: 25.5,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El valor trigger debe ser un número' })
  valor_trigger?: number

  @ApiProperty({
    description: 'accion (requerido solo para tipo sensor)',
    example: 'encender',
    enum: ['encender', 'apagar', 'toggle'],
    required: false
  })
  @IsOptional()
  @IsEnum(['encender', 'apagar', 'toggle'], {
    message: 'La acción debe ser: encender, apagar, toggle'
  })
  accion?: 'encender' | 'apagar' | 'toggle'

  @ApiProperty({
    description: 'delaySegundos',
    example: 0,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El delay debe ser un número' })
  @IsInt({ message: 'El delay debe ser un entero' })
  @Min(0, { message: 'El delay debe ser mayor o igual a 0' })
  delay_segundos?: number

  // Campos para reglas basadas en horarios
  @ApiProperty({
    description: 'Hora de inicio (formato HH:mm, requerido solo para tipo horario)',
    example: '09:00',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser un texto' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe estar en formato HH:mm (00:00 - 23:59)'
  })
  hora_inicio?: string

  @ApiProperty({
    description: 'Hora de fin (formato HH:mm, requerido solo para tipo horario)',
    example: '21:00',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La hora de fin debe ser un texto' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe estar en formato HH:mm (00:00 - 23:59)'
  })
  hora_fin?: string

  @ApiProperty({
    description: 'Días de la semana (0=Domingo, 6=Sábado, null=todos los días)',
    example: [1, 2, 3, 4, 5],
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray({ message: 'Los días de la semana deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un día' })
  @ArrayMaxSize(7, { message: 'No puede seleccionar más de 7 días' })
  dias_semana?: number[]

  @ApiProperty({
    description: 'Acción al inicio del horario',
    example: 'apagar',
    enum: ['encender', 'apagar'],
    required: false
  })
  @IsOptional()
  @IsEnum(['encender', 'apagar'], {
    message: 'La acción de inicio debe ser: encender, apagar'
  })
  accion_inicio?: 'encender' | 'apagar'

  @ApiProperty({
    description: 'Acción al fin del horario',
    example: 'encender',
    enum: ['encender', 'apagar'],
    required: false
  })
  @IsOptional()
  @IsEnum(['encender', 'apagar'], {
    message: 'La acción de fin debe ser: encender, apagar'
  })
  accion_fin?: 'encender' | 'apagar'

  // Campo común
  @ApiProperty({
    description: 'dispositivoId (opcional)',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del dispositivo debe ser un número' })
  @IsInt({ message: 'El ID del dispositivo debe ser un entero' })
  dispositivoId?: number

  @ApiProperty({
    description: 'actuadorId',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El ID del actuador es requerido' })
  @IsNumber({}, { message: 'El ID del actuador debe ser un número' })
  @IsInt({ message: 'El ID del actuador debe ser un entero' })
  actuadorId: number

  @IsOptional()
  habilitada?: boolean
}
