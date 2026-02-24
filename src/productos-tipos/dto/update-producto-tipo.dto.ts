import { PartialType } from '@nestjs/swagger'
import { CreateProductoTipoDto } from './create-producto-tipo.dto'

export class UpdateProductoTipoDto extends PartialType(CreateProductoTipoDto) { }
