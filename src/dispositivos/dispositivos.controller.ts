import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, UsuarioDecorator } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'
import { DispositivosService } from './dispositivos.service'
import { CreateDispositivoDto } from './dto/create-dispositivo.dto'
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto'

@ApiTags('Dispositivos')
@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo dispositivo' })
  @ApiResponse({ status: 201, description: 'Dispositivo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para asignar dispositivos a otros usuarios' })
  create(@Body() createDto: CreateDispositivoDto, @UsuarioDecorator() usuario: Usuario) {
    let usuarioIdFinal: number

    if (createDto.usuarioId) {
      const isAdmin = usuario.roles?.some(rol => rol?.nombre?.toLowerCase() === 'admin') ?? false

      if (!isAdmin && createDto.usuarioId !== usuario.id) {
        throw new ForbiddenException('No tiene permisos para asignar dispositivos a otros usuarios')


      }

      usuarioIdFinal = createDto.usuarioId
    } else {
      usuarioIdFinal = usuario.id
    }

    return this.dispositivosService.create(createDto, usuarioIdFinal)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los dispositivos' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos' })
  findAll() {
    return this.dispositivosService.findAll()
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Listar dispositivos por usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos del usuario' })
  @ApiResponse({ status: 404, description: 'No se encontraron dispositivos para el usuario' })
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.dispositivosService.findByUser(id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un dispositivo por ID' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo encontrado' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number, @Query('horas', ParseIntPipe) horas?: number) {
    return this.dispositivosService.findOne(id, horas)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo actualizado' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDispositivoDto) {
    return this.dispositivosService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo eliminado' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.dispositivosService.remove(id)
    return { message: 'Dispositivo eliminado exitosamente' }
  }

  @Get(':id/lecturas/actuales')
  @ApiOperation({ summary: 'Obtener lecturas actuales de todos los sensores del dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Lecturas actuales obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  obtenerLecturasActuales(@Param('id', ParseIntPipe) id: number) {
    return this.dispositivosService.obtenerLecturasActuales(id)
  }

  @Get(':id/lecturas/historicas')
  @ApiOperation({ summary: 'Obtener lecturas históricas de los sensores del dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Lecturas históricas obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  obtenerLecturasHistoricas(@Param('id', ParseIntPipe) id: number, @Body('horas') horas?: number) {
    return this.dispositivosService.obtenerLecturasHistoricas(id, horas || 24)
  }
}
