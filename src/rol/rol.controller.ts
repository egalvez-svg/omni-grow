import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, RolDecorator, RolesGuard, RolNombre, UsuarioDecorator } from '../shared'

import { CreateRolDto, UpdateRolDto } from './dto'
import { RolService } from './rol.service'

@ApiTags('ROLES')
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createRolDto: CreateRolDto, @UsuarioDecorator('id') userId: number) {
    return this.rolService.create(createRolDto, userId)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.rolService.findAll()
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolService.findOne(+id)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto, @UsuarioDecorator('id') userId: number) {
    return this.rolService.update(+id, updateRolDto, userId)
  }

  @RolDecorator(RolNombre.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UsuarioDecorator('id') userId: number) {
    return this.rolService.remove(+id, userId)
  }
}
