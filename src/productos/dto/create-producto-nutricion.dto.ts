import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateProductoNutricionDto {
  @ApiProperty({ example: 'FloraGro', description: 'Nombre del producto' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @ApiProperty({ example: 'Fertilizante base para vegetativo', description: 'Descripción opcional', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({ example: 'General Hydroponics', description: 'Fabricante del producto', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fabricante?: string

  @ApiProperty({ example: true, description: 'Estado actual del producto', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean

  @ApiProperty({ example: 1, description: 'ID del tipo de producto' })
  @IsNotEmpty()
  @IsNumber()
  tipoId: number
}
