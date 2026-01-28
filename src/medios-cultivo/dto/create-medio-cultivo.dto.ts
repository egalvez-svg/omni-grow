import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedioCultivoDto {
    @ApiProperty({ example: 'Sustrato', description: 'Nombre del medio de cultivo' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre: string;

    @ApiProperty({ example: 'Mezcla de turba y perlita', description: 'Descripción detallada del medio', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;
}
