import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
    @ApiProperty({ description: 'Contraseña actual' })
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @ApiProperty({ description: 'Nueva contraseña' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
    newPassword: string
}
