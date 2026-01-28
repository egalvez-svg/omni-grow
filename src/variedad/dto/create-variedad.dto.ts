import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateVariedadDto {
  @ApiProperty({ example: 'Gorilla Glue', description: 'Nombre de la variedad' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @ApiProperty({ example: 'Híbrido muy potente', description: 'Descripción opcional', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({ example: 'Royal Queen Seeds', description: 'Banco de semillas', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  banco?: string

  @ApiProperty({
    example: 'hibrida',
    enum: ['indica', 'sativa', 'hibrida', 'rudelaris'],
    required: false
  })
  @IsOptional()
  @IsEnum(['indica', 'sativa', 'hibrida', 'rudelaris'])
  tipo?: 'indica' | 'sativa' | 'hibrida' | 'rudelaris'
}
