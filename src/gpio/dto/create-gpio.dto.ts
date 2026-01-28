import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min
} from 'class-validator'

export class CreateGpioDto {
  @ApiProperty({
    description: 'dispositivoId',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El ID del dispositivo es requerido' })
  @IsNumber({}, { message: 'El ID del dispositivo debe ser un número' })
  @IsInt({ message: 'El ID del dispositivo debe ser un entero' })
  dispositivoId: number

  @ApiProperty({
    description: 'pin',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El número de pin es requerido' })
  @IsNumber({}, { message: 'El pin debe ser un número' })
  @IsInt({ message: 'El pin debe ser un entero' })
  @Min(0, { message: 'El pin debe ser mayor o igual a 0' })
  @Max(40, { message: 'El pin debe ser menor o igual a 40' })
  pin: number

  @ApiProperty({
    description: 'tipo',
    example: 'sensor',
    required: true
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsEnum(['sensor', 'actuador'], {
    message: 'El tipo debe ser: sensor o actuador'
  })
  tipo: 'sensor' | 'actuador'

  @ApiProperty({
    description: 'nombre',
    example: 'Sensor de temperatura',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre?: string

  @ApiProperty({
    description: 'activo',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Activo debe ser un valor booleano' })
  activo?: boolean
}
