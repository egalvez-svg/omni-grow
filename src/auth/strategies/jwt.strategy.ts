import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { JWT_SECRET, MessageDto } from '../../shared'
import { Usuario } from '../../usuario/entities/usuario.entity'
import { AuthService } from '../auth.service'

import { PayloadInterface } from './../payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET)
    })
  }

  async validate(payload: PayloadInterface) {
    const { usuario, email } = payload
    const user = await this.authService.findOneByUsuarioEmail(usuario, email)
    if (!user) {
      throw new UnauthorizedException(new MessageDto('credenciales erróneas o usuario inactivo'))
    }
    return user
  }
}
