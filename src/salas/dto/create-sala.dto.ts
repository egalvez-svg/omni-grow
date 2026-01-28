import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateSalaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @IsOptional()
  @IsString()
  descripcion?: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  ubicacion?: string

  @ApiProperty({
    description: 'IDs de los dispositivos a asignar a la sala',
    example: [1, 2],
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  dispositivoIds?: number[]
}
