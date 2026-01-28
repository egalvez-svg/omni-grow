import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
    @ApiProperty({ description: 'Correo electrónico del usuario' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
    email: string
}
