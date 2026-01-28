import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator'

export class CreateCamaDto {
  @ApiProperty({ example: 'Cama 1', description: 'Nombre de la cama' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @ApiProperty({ example: 'Cama principal de vegetativo', description: 'Descripción opcional', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({ example: 40, description: 'Capacidad máxima de plantas' })
  @IsOptional()
  @IsInt()
  @Min(0)
  capacidad_plantas?: number

  @ApiProperty({ example: 4, description: 'Número de filas en la cuadrícula' })
  @IsOptional()
  @IsInt()
  @Min(0)
  filas?: number

  @ApiProperty({ example: 10, description: 'Número de columnas en la cuadrícula' })
  @IsOptional()
  @IsInt()
  @Min(0)
  columnas?: number

  @ApiProperty({ example: 1, description: 'ID de la sala a la que pertenece' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  salaId: number
}
