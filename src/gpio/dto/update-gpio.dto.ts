import { PartialType } from '@nestjs/swagger'

import { CreateGpioDto } from './create-gpio.dto'

export class UpdateGpioDto extends PartialType(CreateGpioDto) {}
