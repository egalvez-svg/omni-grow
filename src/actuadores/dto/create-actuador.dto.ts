import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateActuadorDto {
  @ApiProperty({
    description: 'gpioId',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El ID del GPIO es requerido' })
  @IsNumber({}, { message: 'El ID del GPIO debe ser un número' })
  @IsInt({ message: 'El ID del GPIO debe ser un entero' })
  gpioId: number

  @ApiProperty({
    description: 'tipo',
    example: 'encendido',
    required: true
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser un texto' })
  @MaxLength(50, { message: 'El tipo no puede exceder 50 caracteres' })
  tipo: string

  @ApiProperty({
    description: 'estadoDefault',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado default debe ser un valor booleano' })
  estadoDefault?: boolean

  @ApiProperty({
    description: 'activo',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Activo debe ser un valor booleano' })
  activo?: boolean
}
