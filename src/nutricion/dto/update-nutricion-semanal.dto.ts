import { PartialType } from '@nestjs/swagger'
import { CreateNutricionSemanalDto } from './create-nutricion-semanal.dto'

export class UpdateNutricionSemanalDto extends PartialType(CreateNutricionSemanalDto) {}
