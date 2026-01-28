import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateModuloDto {
    @ApiProperty({ example: 'Dispositivos y Sensores' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre: string;

    @ApiProperty({ example: 'dispositivos' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    slug: string;

    @ApiProperty({ example: 'Acceso a hardware y análisis automático' })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

export class UpdateModuloDto extends PartialType(CreateModuloDto) { }
