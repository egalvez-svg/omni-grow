import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreateProductoControlPlagaDto {
    @ApiProperty({ example: 1, description: 'ID del producto' })
    @IsNotEmpty()
    @IsNumber()
    productoId: number

    @ApiProperty({ example: 5, description: 'Cantidad aplicada' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    cantidad: number

    @ApiProperty({ example: 'ml', description: 'Unidad de medida', default: 'ml' })
    @IsNotEmpty()
    @IsString()
    unidad: string
}
