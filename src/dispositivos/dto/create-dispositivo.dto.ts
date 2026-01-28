import { ApiProperty } from '@nestjs/swagger'
import { IsIP, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateDispositivoDto {
  @ApiProperty({
    description: 'Nombre del dispositivo',
    example: 'Dispositivo 1',
    required: true
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string

  @ApiProperty({
    description: 'Descripción del dispositivo',
    example: 'Descripción del dispositivo',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string

  @ApiProperty({
    description: 'Ubicación del dispositivo',
    example: 'Ubicación del dispositivo',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  @MaxLength(150, { message: 'La ubicación no puede exceder 150 caracteres' })
  ubicacion?: string

  @ApiProperty({
    description: 'IP del dispositivo',
    example: '192.168.1.1',
    required: false
  })
  @IsOptional()
  @IsIP('4', { message: 'La IP debe ser una dirección IPv4 válida' })
  ip?: string

  @ApiProperty({
    description:
      'ID del usuario propietario (solo admins pueden especificarlo, usuarios normales usan su propio ID automáticamente)',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'El usuarioId debe ser un número entero' })
  @IsPositive({ message: 'El usuarioId debe ser un número positivo' })
  usuarioId?: number

  @ApiProperty({
    description: 'ID de la sala a la que pertenece el dispositivo',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'El salaId debe ser un número entero' })
  @IsPositive({ message: 'El salaId debe ser un número positivo' })
  salaId?: number
}
