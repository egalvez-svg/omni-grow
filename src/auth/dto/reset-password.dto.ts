import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
    @ApiProperty({ description: 'Token de recuperación' })
    @IsNotEmpty()
    @IsString()
    token: string

    @ApiProperty({ description: 'Nueva contraseña' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
    password: string
}
