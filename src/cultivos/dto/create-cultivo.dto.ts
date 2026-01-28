import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from 'class-validator'

export class CreateCultivoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @IsNotEmpty()
  @IsNumber()
  salaId: number

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  variedadIds: number[]

  @IsOptional()
  @IsNumber()
  camaId?: number

  @IsNotEmpty()
  @IsDateString()
  fecha_inicio: string

  @IsOptional()
  @IsDateString()
  fecha_fin?: string

  @IsOptional()
  @IsEnum(['esqueje', 'vegetativo', 'floracion', 'cosecha', 'finalizado'])
  estado?: 'esqueje' | 'vegetativo' | 'floracion' | 'cosecha' | 'finalizado'

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cantidad_plantas?: number

  @IsOptional()
  @IsString()
  notas?: string

  @IsOptional()
  @IsNumber()
  medioCultivoId?: number
}
