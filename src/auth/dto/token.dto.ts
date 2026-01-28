import { ApiProperty } from '@nestjs/swagger'

import { IsNotBlank } from '../../shared'

export class TokenDto {
  @ApiProperty({
    description: 'token'
  })
  @IsNotBlank({ message: 'el tokeb del usuario no puede estar vacío' })
  token: string
}
