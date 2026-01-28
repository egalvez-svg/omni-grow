import { ApiProperty } from '@nestjs/swagger'

import { MaxLength } from 'class-validator'

import { IsNotBlank } from '../../shared'

export class LoginUsuarioDto {
  @ApiProperty({
    description: 'usuario'
  })
  @IsNotBlank({ message: 'el nombre de usuario no puede estar vacío' })
  @MaxLength(10, { message: 'nombre de usuario: longitud máxima de 10' })
  usuario: string

  @ApiProperty({
    description: 'password'
  })
  @IsNotBlank({ message: 'la contraseña del usuario no puede estar vacía' })
  password: string
}
