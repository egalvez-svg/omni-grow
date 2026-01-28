import { IsEnum, IsNotEmpty } from 'class-validator'

export class EjecutarAccionDto {
  @IsNotEmpty({ message: 'La acción es requerida' })
  @IsEnum(['encender', 'apagar'], {
    message: 'La acción debe ser: encender o apagar'
  })
  accion: 'encender' | 'apagar'
}
