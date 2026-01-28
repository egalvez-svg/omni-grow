import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator'

import { ProductoRiegoDto } from './producto-riego.dto'

export class CreateNutricionSemanalDto {
  @ApiProperty({ example: 4, description: 'Semana de cultivo (opcional, se calcula si no se provee)', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  semana?: number

  @ApiProperty({
    example: 'nutricion',
    enum: ['nutricion', 'solo_agua', 'lavado_raices', 'agua_esquejes'],
    description: 'Tipo de riego'
  })
  @IsOptional()
  @IsEnum(['nutricion', 'solo_agua', 'lavado_raices', 'agua_esquejes'])
  tipo_riego?: 'nutricion' | 'solo_agua' | 'lavado_raices' | 'agua_esquejes'

  @ApiProperty({ example: '2023-11-20', description: 'Fecha de aplicación' })
  @IsNotEmpty()
  @IsDateString()
  fecha_aplicacion: string

  @ApiProperty({ example: 10.5, description: 'Litros de agua utilizados' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  litros_agua: number

  @ApiProperty({ example: 6.2, description: 'pH de la mezcla', required: false })
  @IsOptional()
  @IsNumber()
  ph?: number

  @ApiProperty({ example: 1.8, description: 'EC de la mezcla', required: false })
  @IsOptional()
  @IsNumber()
  ec?: number

  @ApiProperty({ example: 'Mezcla base con estimulador de raíces', description: 'Notas opcionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string

  @ApiProperty({ type: [ProductoRiegoDto], description: 'Lista de productos aplicados' })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductoRiegoDto)
  productos: ProductoRiegoDto[]
}
