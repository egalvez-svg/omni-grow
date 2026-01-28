import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateLecturaDto {
  @ApiProperty({
    description: 'sensorId',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El ID del sensor es requerido' })
  @IsNumber({}, { message: 'El ID del sensor debe ser un número' })
  @IsInt({ message: 'El ID del sensor debe ser un entero' })
  sensorId: number

  @ApiProperty({
    description: 'valor',
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  valor: number
}
