import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CambiarFaseDto {
    @ApiProperty({ description: 'ID de la nueva fase', example: 3 })
    @IsNotEmpty()
    @IsNumber()
    nuevaFaseId: number

    @ApiProperty({ description: 'Comentarios o notas sobre la transición', required: false })
    @IsOptional()
    @IsString()
    notas?: string

    @ApiProperty({ description: 'ID de la nueva sala (opcional)', required: false, example: 1 })
    @IsOptional()
    @IsNumber()
    salaId?: number

    @ApiProperty({ description: 'ID de la nueva cama (opcional)', required: false, example: 1 })
    @IsOptional()
    @IsNumber()
    camaId?: number

    @ApiProperty({ description: 'ID del nuevo medio de cultivo (opcional)', required: false, example: 1 })
    @IsOptional()
    @IsNumber()
    medioCultivoId?: number
}
