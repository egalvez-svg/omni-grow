import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, RolDecorator, RolesGuard, RolNombre, UsuarioDecorator } from '../shared'

import { CreateUsuarioDto, SetRolDto, UpdateUsuarioDto, SetModulosDto } from './dto/'
import { UsuarioService } from './usuario.service'

@ApiTags('USUARIO')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto, @UsuarioDecorator('id') userId: number) {
    return this.usuarioService.create(createUsuarioDto, userId)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.usuarioService.findAll()
  }
  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id)
  }
  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/rol')
  setRol(@Param('id') id: string, @Body() rolDto: SetRolDto) {
    return this.usuarioService.setRol(+id, rolDto)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/modulos')
  setModulos(@Param('id') id: string, @Body() modulosDto: SetModulosDto) {
    return this.usuarioService.setModulos(+id, modulosDto)
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @UsuarioDecorator('id') userId: number) {
    return this.usuarioService.update(+id, updateUsuarioDto, userId)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UsuarioDecorator('id') userId: number) {
    return this.usuarioService.remove(+id, userId)
  }
}
