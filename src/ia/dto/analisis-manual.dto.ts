import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalisisManualDto {
    @ApiProperty({ example: 24.5, description: 'Temperatura ambiente en grados Celsius' })
    @IsNumber()
    temperatura: number;

    @ApiProperty({ example: 60.5, description: 'Humedad relativa en porcentaje' })
    @IsNumber()
    humedad: number;

    @ApiProperty({ example: 5.8, description: 'pH actual de la solución o sustrato', required: false })
    @IsNumber()
    @IsOptional()
    ph?: number;

    @ApiProperty({ example: 1.2, description: 'Electroconductividad (EC) actual', required: false })
    @IsNumber()
    @IsOptional()
    ec?: number;

    @ApiProperty({ example: 'Sigo viendo las hojas un poco claras', description: 'Notas adicionales del usuario', required: false })
    @IsString()
    @IsOptional()
    notas_usuario?: string;
}
