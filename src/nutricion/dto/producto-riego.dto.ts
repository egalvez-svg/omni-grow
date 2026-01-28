import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class ProductoRiegoDto {
  @ApiProperty({ example: 1, description: 'ID del producto de nutrición' })
  @IsNotEmpty()
  @IsNumber()
  productoNutricionId: number

  @ApiProperty({ example: 2.5, description: 'Dosis en ml/L o g/L' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  dosis_por_litro: number
}
