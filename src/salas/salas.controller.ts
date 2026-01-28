import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, UsuarioDecorator } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'
import { CreateSalaDto } from './dto/create-sala.dto'
import { UpdateSalaDto } from './dto/update-sala.dto'
import { SalasService } from './salas.service'

@ApiTags('Salas')
@Controller('salas')
@UseGuards(JwtAuthGuard)
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sala' })
  @ApiResponse({ status: 201, description: 'Sala creada exitosamente' })
  create(@Body() dto: CreateSalaDto, @UsuarioDecorator() usuario: Usuario) {
    return this.salasService.create(dto, usuario.id)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las salas' })
  findAll() {
    return this.salasService.findAll()
  }

  @Get('usuario')
  @ApiOperation({ summary: 'Listar salas del usuario autenticado' })
  findByUser(@UsuarioDecorator() usuario: Usuario) {
    return this.salasService.findByUser(usuario.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una sala' })
  @ApiParam({ name: 'id', description: 'ID de la sala', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiParam({ name: 'id', description: 'ID de la sala', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalaDto) {
    return this.salasService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sala' })
  @ApiParam({ name: 'id', description: 'ID de la sala', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.salasService.remove(id)
    return { message: 'Sala eliminada exitosamente' }
  }
}
