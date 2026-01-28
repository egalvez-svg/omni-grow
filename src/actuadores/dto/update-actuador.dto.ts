import { PartialType } from '@nestjs/swagger'

import { CreateActuadorDto } from './create-actuador.dto'

export class UpdateActuadorDto extends PartialType(CreateActuadorDto) {}
