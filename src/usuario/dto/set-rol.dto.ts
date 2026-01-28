import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator'

export class SetRolDto {
  @ApiProperty({
    example: [1, 2],
    description: 'Array de IDs de roles a asignar al usuario',
    required: true,
    type: [Number]
  })
  @IsArray({ message: 'rol_ids debe ser un array' })
  @ArrayMinSize(1, { message: 'debe proporcionar al menos un rol' })
  @IsNumber({}, { each: true, message: 'cada rol_id debe ser un número' })
  rol_ids: number[]
}
