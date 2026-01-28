import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('No Bearer token found')
        }

        const token = authHeader.slice(7)
        try {
            const payload = this.jwtService.verify(token)
            request.user = payload
            return true
        } catch (error) {
            console.error('JWT Verification failed:', error.message)
            throw new UnauthorizedException(`Token validation failed: ${error.message}`)
        }
    }
}
