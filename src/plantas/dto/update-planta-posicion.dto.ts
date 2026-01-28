import { PartialType } from '@nestjs/swagger'
import { CreatePlantaPosicionDto } from './create-planta-posicion.dto'

export class UpdatePlantaPosicionDto extends PartialType(CreatePlantaPosicionDto) {}
