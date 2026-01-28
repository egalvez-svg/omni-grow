import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../decorators/requires-module.decorator';

@Injectable()
export class ModuleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredModule = this.reflector.getAllAndOverride<string>(MODULE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredModule) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            return false;
        }

        const hasModule = user.modulos?.some(m => m.slug === requiredModule);

        if (!hasModule) {
            throw new ForbiddenException(`No tienes acceso al módulo: ${requiredModule}`);
        }

        return true;
    }
}
