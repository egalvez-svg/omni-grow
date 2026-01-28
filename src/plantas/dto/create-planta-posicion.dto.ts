import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreatePlantaPosicionDto {
  @ApiProperty({ example: 1, description: 'Fila (X) de la planta en la cuadrícula' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  fila: number

  @ApiProperty({ example: 1, description: 'Columna (Y) de la planta en la cuadrícula' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  columna: number

  @ApiProperty({
    example: 'activa',
    enum: ['activa', 'removida', 'cosechada'],
    required: false
  })
  @IsOptional()
  @IsEnum(['activa', 'removida', 'cosechada'])
  estado?: 'activa' | 'removida' | 'cosechada'

  @ApiProperty({ example: 'P001', description: 'Código único de la planta', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string

  @ApiProperty({ example: 1, description: 'ID de la variedad', required: false })
  @IsOptional()
  @IsNumber()
  variedadId?: number

  @ApiProperty({ example: '2023-10-27', description: 'Fecha de plantación' })
  @IsNotEmpty()
  @IsDateString()
  fecha_plantacion: string

  @ApiProperty({ example: 'Planta con algo de estrés hídrico', description: 'Notas opcionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string
}
