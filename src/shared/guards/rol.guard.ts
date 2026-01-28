import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    console.log('Required roles for handler:', roles)
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user
    console.log('User from request:', JSON.stringify(user))
    if (!user || !user.roles) {
      console.log('No user or no roles in user object')
      return false
    }
    const userRoles = user.roles.map((rol: any) => (typeof rol === 'string' ? rol : rol.nombre))
    console.log('Parsed user roles:', userRoles)
    const hasRole = roles.some((role: string) => userRoles.includes(role))
    console.log('Has required role?', hasRole)
    return hasRole
  }
}
