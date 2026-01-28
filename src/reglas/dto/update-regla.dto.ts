import { PartialType } from '@nestjs/swagger'

import { CreateReglaDto } from './create-regla.dto'

export class UpdateReglaDto extends PartialType(CreateReglaDto) {}
