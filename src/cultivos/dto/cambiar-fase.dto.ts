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
}
