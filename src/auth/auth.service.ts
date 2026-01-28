import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
import { Repository } from 'typeorm'

import { MessageDto, TOKEN_EXPIRE } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'

import { MailService } from '../mail/mail.service'
import { ChangePasswordDto, ForgotPasswordDto, LoginUsuarioDto, RefreshTokenDto, ResetPasswordDto } from './dto/'
import { PayloadInterface } from './payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly _authRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) { }

  async login(dto: LoginUsuarioDto) {
    const { usuario } = dto
    const user = await this.findOneByUsuarioOEmail(usuario)

    if (!user) throw new UnauthorizedException(new MessageDto('no existe el usuario'))

    const passwordOK = await compare(dto.password, user.password)
    if (!passwordOK) throw new UnauthorizedException(new MessageDto('contraseña errónea'))

    const payload: PayloadInterface = {
      id: user.id,
      usuario: user.usuario,
      email: user.email,
      roles: user.roles.map(rol => rol.nombre),
      modulos: user.modulos.map(m => ({ slug: m.slug }))
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(TOKEN_EXPIRE) || '15m'
    })

    const refreshToken = this.jwtService.sign({ id: user.id }, {
      expiresIn: '7d'
    })

    // Persistir el refresh token (hasheado) sin disparar ganchos de entidad
    const hashedRefresh = await hash(refreshToken, 10)
    await this._authRepository.update(user.id, { refresh_token: hashedRefresh })

    return { accessToken, refreshToken }
  }

  async logout(user: Usuario) {
    await this._authRepository.update(user.id, { refresh_token: undefined })
    return new MessageDto('Sesión cerrada exitosamente')
  }

  async changePassword(user: Usuario, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto

    // Cargar el usuario con el password (ya que usualmente está oculto)
    const userWithPass = await this._authRepository.findOne({
      where: { id: user.id },
      select: ['id', 'password']
    })

    if (!userWithPass) {
      throw new BadRequestException(new MessageDto('Usuario no encontrado'))
    }

    const isMatch = await compare(oldPassword, userWithPass.password)
    if (!isMatch) {
      throw new UnauthorizedException(new MessageDto('La contraseña actual es incorrecta'))
    }

    userWithPass.password = await hash(newPassword, 10)
    await this._authRepository.save(userWithPass)

    return new MessageDto('Contraseña actualizada correctamente')
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto
    const user = await this._authRepository.findOne({ where: { email, activo: true } })

    if (user) {
      // Generar token de recuperación
      const token = randomBytes(20).toString('hex')
      const expires = new Date()
      expires.setHours(expires.getHours() + 1) // 1 hora de validez

      user.recovery_token = token
      user.recovery_token_expires = expires
      await this._authRepository.save(user)

      // await this.mailService.sendPasswordRecovery(user.email, token, user.usuario)
      return {
        message: 'Se ha generado un token de recuperación',
        token: token // ADVERTENCIA: Solo retorno esto para propósitos de desarrollo/demo
      }

      // return new MessageDto('Se ha enviado un correo con instrucciones para restablecer su contraseña')
    }

    return new MessageDto('Si el correo está registrado, se enviarán instrucciones')
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, password } = dto

    const user = await this._authRepository.findOne({
      where: {
        recovery_token: token,
        activo: true
      },
      select: ['id', 'password', 'recovery_token', 'recovery_token_expires']
    })

    if (!user || !user.recovery_token_expires || user.recovery_token_expires < new Date()) {
      throw new UnauthorizedException(new MessageDto('Token inválido o expirado'))
    }

    user.password = await hash(password, 10)
    user.recovery_token = undefined
    user.recovery_token_expires = undefined

    await this._authRepository.save(user)

    return new MessageDto('La contraseña ha sido restablecida con éxito')
  }

  async findOneByUsuarioEmail(usuario: string, email: string): Promise<Usuario | null> {
    return this._authRepository.findOne({
      where: { activo: true, usuario: usuario, email: email },
      relations: ['roles', 'modulos']
    })
  }

  async findOneByUsuario(usuario: string): Promise<Usuario | null> {
    return this._authRepository.findOne({
      where: { activo: true, usuario: usuario }
    })
  }

  async findOneByUsuarioOEmail(usuario: string) {
    return this._authRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.roles', 'roles')
      .leftJoinAndSelect('usuario.modulos', 'modulos')
      .where('(usuario.usuario = :usuario OR usuario.email = :usuario)', { usuario })
      .andWhere('usuario.activo = :activo', { activo: true })
      .addSelect('usuario.password')
      .addSelect('usuario.refresh_token')
      .getOne()
  }

  async refresh(dto: RefreshTokenDto): Promise<any> {
    const { refreshToken } = dto
    let payload_ref: any

    try {
      payload_ref = this.jwtService.verify(refreshToken)
    } catch {
      throw new UnauthorizedException(new MessageDto('Token de refresco inválido o expirado'))
    }

    const user = await this._authRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.roles', 'roles')
      .leftJoinAndSelect('usuario.modulos', 'modulos')
      .where('usuario.id = :id', { id: payload_ref.id })
      .andWhere('usuario.activo = :activo', { activo: true })
      .addSelect('usuario.refresh_token')
      .getOne()

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException(new MessageDto('Usuario no encontrado o sesión no válida'))
    }

    const isMatch = await compare(refreshToken, user.refresh_token)
    if (!isMatch) {
      throw new UnauthorizedException(new MessageDto('Token de refresco no coincide'))
    }

    const payload: PayloadInterface = {
      id: user.id,
      usuario: user.usuario,
      email: user.email,
      roles: user.roles.map(rol => rol.nombre),
      modulos: user.modulos.map(m => ({ slug: m.slug }))
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(TOKEN_EXPIRE) || '15m'
    })

    return { accessToken }
  }
}
