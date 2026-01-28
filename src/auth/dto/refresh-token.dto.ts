import { ApiProperty } from '@nestjs/swagger'
import { IsNotBlank } from '../../shared'

export class RefreshTokenDto {
    @ApiProperty({ description: 'Refresh token del usuario' })
    @IsNotBlank({ message: 'El refresh token no puede estar vacío' })
    refreshToken: string
}
