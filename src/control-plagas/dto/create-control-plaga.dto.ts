import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { CreateProductoControlPlagaDto } from './create-producto-control-plaga.dto'

export class CreateControlPlagaDto {
    @ApiProperty({ example: 1, description: 'ID del cultivo' })
    @IsNotEmpty()
    @IsNumber()
    cultivoId: number

    @ApiProperty({ example: '2024-03-20', description: 'Fecha de la aplicación' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fecha_aplicacion: Date

    @ApiProperty({
        example: 'foliar',
        description: 'Método de aplicación',
        enum: ['foliar', 'riego', 'manual', 'otro'],
        default: 'foliar'
    })
    @IsEnum(['foliar', 'riego', 'manual', 'otro'])
    metodo_aplicacion: 'foliar' | 'riego' | 'manual' | 'otro'

    @ApiProperty({ example: 'Aplicación preventiva de aceite de neem', description: 'Notas opcionales', required: false })
    @IsOptional()
    @IsString()
    notas?: string

    @ApiProperty({ type: [CreateProductoControlPlagaDto], description: 'Lista de productos aplicados' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductoControlPlagaDto)
    productos: CreateProductoControlPlagaDto[]
}
