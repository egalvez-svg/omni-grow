import { PartialType } from '@nestjs/swagger'
import { CreateVariedadDto } from './create-variedad.dto'

export class UpdateVariedadDto extends PartialType(CreateVariedadDto) {}
