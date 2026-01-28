import { PartialType } from '@nestjs/swagger'
import { CreateProductoNutricionDto } from './create-producto-nutricion.dto'

export class UpdateProductoNutricionDto extends PartialType(CreateProductoNutricionDto) {}
