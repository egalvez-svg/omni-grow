import { PartialType } from '@nestjs/swagger'
import { CreateControlPlagaDto } from './create-control-plaga.dto'

export class UpdateControlPlagaDto extends PartialType(CreateControlPlagaDto) { }
