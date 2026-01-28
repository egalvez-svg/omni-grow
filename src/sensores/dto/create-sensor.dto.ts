import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateSensorDto {
  @ApiProperty({ description: 'gpioId', example: 1, required: true })
  @IsNotEmpty({ message: 'El ID del GPIO es requerido' })
  @IsNumber({}, { message: 'El ID del GPIO debe ser un número' })
  @IsInt({ message: 'El ID del GPIO debe ser un entero' })
  gpioId: number

  @ApiProperty({ description: 'tipo', example: 'temperatura', required: true })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser un texto' })
  @MaxLength(50, { message: 'El tipo no puede exceder 50 caracteres' })
  tipo: string

  @ApiProperty({ description: 'unidad', example: 'Celsius', required: true })
  @IsNotEmpty({ message: 'La unidad es requerida' })
  @IsString({ message: 'La unidad debe ser un texto' })
  @MaxLength(20, { message: 'La unidad no puede exceder 20 caracteres' })
  unidad: string

  @ApiProperty({ description: 'activo', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'Activo debe ser un valor booleano' })
  activo?: boolean
}
