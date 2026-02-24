import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateProductoTipoDto {
    @ApiProperty({ example: 'Riego', description: 'Nombre del tipo de producto' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    nombre: string

    @ApiProperty({ example: 'Productos para riego base', description: 'Descripción opcional', required: false })
    @IsOptional()
    @IsString()
    descripcion?: string
}
