import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetModulosDto {
    @ApiProperty({ example: [1, 2], description: 'Array de IDs de los módulos a asignar' })
    @IsArray()
    @IsNumber({}, { each: true })
    moduloIds: number[];
}
