import { PartialType } from '@nestjs/swagger';
import { CreateMedioCultivoDto } from './create-medio-cultivo.dto';

export class UpdateMedioCultivoDto extends PartialType(CreateMedioCultivoDto) { }
