import { ApiProperty } from '@nestjs/swagger'

import { IsEnum } from 'class-validator'

import { RolNombre } from '../../shared/enums/rol.enum'

export class CreateRolDto {
  @ApiProperty({ description: 'nombre' })
  @IsEnum(RolNombre, { message: `el rol sólo puede ser ${RolNombre.ADMIN}, ${RolNombre.BODEGA} o ${RolNombre.USER}` })
  nombre: RolNombre
}
