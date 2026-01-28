import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsuarioModule } from '../usuario/usuario.module'
import { MailModule } from '../mail/mail.module'

import { JWT_SECRET, TOKEN_EXPIRE } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(TOKEN_EXPIRE)
        }
      }),
      inject: [ConfigService]
    }),
    UsuarioModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, JwtModule]
})
export class AuthModule { }
