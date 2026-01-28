import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, RolDecorator, RolesGuard, UsuarioDecorator } from '../shared'
import { RolNombre } from '../shared/enums'
import { UsuarioService } from '../usuario/usuario.service'

import { AuthService } from './auth.service'
import { ChangePasswordDto, ForgotPasswordDto, LoginUsuarioDto, RefreshTokenDto, ResetPasswordDto } from './dto/'

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService
  ) { }

  @Post('login')
  login(@Body() dto: LoginUsuarioDto) {
    return this.authService.login(dto)
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@UsuarioDecorator() user: any) {
    return this.authService.logout(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findUser(@UsuarioDecorator() user: any) {
    return await this.usuarioService.findOne(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@UsuarioDecorator() user: any, @Body() dto: ChangePasswordDto) {
    return await this.authService.changePassword(user, dto)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto)
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto)
  }
}
