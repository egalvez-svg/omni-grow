import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const UsuarioDecorator = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user

  // Si se pasa `data`, extraer esa propiedad específica del usuario
  return data ? user?.[data] : user
})
