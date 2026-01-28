import { ApiProperty } from '@nestjs/swagger'

import { IsEmail, IsString, MaxLength } from 'class-validator'

import { IsNotBlank } from '../../shared'

export class CreateUsuarioDto {
  @ApiProperty({ description: 'nombre' })
  @IsString()
  @IsNotBlank({ message: 'el nombre no puede estar vacío' })
  @MaxLength(25, { message: 'nombre: longitud máxima de 25' })
  nombre: string

  @ApiProperty({ description: 'apellido_paterno' })
  @IsString()
  @IsNotBlank({ message: 'el apellido paterno no puede estar vacío' })
  @MaxLength(25, { message: 'apellido paterno: longitud máxima de 25' })
  apellido_paterno: string

  @ApiProperty({ description: 'apellido_materno' })
  @IsString()
  @MaxLength(25, { message: 'apellido materno: longitud máxima de 25' })
  apellido_materno: string

  @ApiProperty({ description: 'usuario' })
  @IsNotBlank({ message: 'el nombre de usuario no puede estar vacío' })
  @MaxLength(10, { message: 'nombre de usuario: longitud máxima de 10' })
  usuario: string

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'password' })
  @IsNotBlank({ message: 'la contraseña del usuario no puede estar vacía' })
  password: string
}
