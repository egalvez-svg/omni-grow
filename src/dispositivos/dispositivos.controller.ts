import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard, ModuleGuard, RequiresModule, RolDecorator, RolesGuard, RolNombre, UsuarioDecorator } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'
import { DispositivosService } from './dispositivos.service'
import { CreateDispositivoDto } from './dto/create-dispositivo.dto'
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto'

@ApiTags('Dispositivos')
@Controller('dispositivos')
@UseGuards(JwtAuthGuard, ModuleGuard, RolesGuard)
@RequiresModule('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) { }

  @Post()
  @RolDecorator(RolNombre.ADMIN) // Added RolDecorator for mutation
  @ApiOperation({ summary: 'Crear un nuevo dispositivo' })
  @ApiResponse({ status: 201, description: 'Dispositivo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para asignar dispositivos a otros usuarios' })
  create(@Body() createDto: CreateDispositivoDto, @UsuarioDecorator() usuario: Usuario) {
    let usuarioIdFinal: number

    if (createDto.usuarioId) {
      usuarioIdFinal = createDto.usuarioId
    } else {
      usuarioIdFinal = usuario.id
    }

    return this.dispositivosService.create(createDto, usuarioIdFinal)
  }

  @Get()
  @RolDecorator(RolNombre.ADMIN)
  @ApiOperation({ summary: 'Listar todos los dispositivos (Administración)' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  findAll() {
    return this.dispositivosService.findAll()
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Listar dispositivos por usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos del usuario' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para ver dispositivos de otro usuario' })
  @ApiResponse({ status: 404, description: 'No se encontraron dispositivos para el usuario' })
  findByUser(@Param('id', ParseIntPipe) id: number, @UsuarioDecorator() usuario: Usuario) {
    const isAdmin = usuario.roles?.some(rol => rol?.nombre?.toLowerCase() === 'admin') ?? false
    if (!isAdmin && id !== usuario.id) {
      throw new ForbiddenException('No tiene permisos para ver los dispositivos de otro usuario')
    }
    return this.dispositivosService.findByUser(id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un dispositivo por ID' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para ver este dispositivo' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioDecorator() usuario: Usuario,
    @Query('horas', ParseIntPipe) horas?: number
  ) {
    const dispositivo = await this.dispositivosService.findOne(id, horas)

    const isAdmin = usuario.roles?.some(rol => rol?.nombre?.toLowerCase() === 'admin') ?? false
    if (!isAdmin && dispositivo.usuarioId !== usuario.id) {
      throw new ForbiddenException('No tiene permiso para ver este dispositivo')
    }

    return dispositivo
  }

  @Patch(':id')
  @RolDecorator(RolNombre.ADMIN)
  @ApiOperation({ summary: 'Actualizar un dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo actualizado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para actualizar este dispositivo' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDispositivoDto,
    @UsuarioDecorator() usuario: Usuario
  ) {
    await this.dispositivosService.findOne(id)
    return this.dispositivosService.update(id, updateDto)

    return this.dispositivosService.update(id, updateDto)
  }

  @Delete(':id')
  @RolDecorator(RolNombre.ADMIN)
  @ApiOperation({ summary: 'Eliminar un dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Dispositivo eliminado' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para eliminar este dispositivo' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number, @UsuarioDecorator() usuario: Usuario) {
    await this.dispositivosService.findOne(id)

    await this.dispositivosService.remove(id)
    return { message: 'Dispositivo eliminado exitosamente' }
  }

  @Get(':id/lecturas/actuales')
  @ApiOperation({ summary: 'Obtener lecturas actuales de todos los sensores del dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Lecturas actuales obtenidas exitosamente' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para ver estas lecturas' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async obtenerLecturasActuales(@Param('id', ParseIntPipe) id: number, @UsuarioDecorator() usuario: Usuario) {
    const dispositivo = await this.dispositivosService.repo.findOne({ where: { id } })
    if (!dispositivo) throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`)

    const isAdmin = usuario.roles?.some(rol => rol?.nombre?.toLowerCase() === 'admin') ?? false
    if (!isAdmin && dispositivo.usuarioId !== usuario.id) {
      throw new ForbiddenException('No tiene permiso para ver las lecturas de este dispositivo')
    }

    return this.dispositivosService.obtenerLecturasActuales(id)
  }

  @Get(':id/lecturas/historicas')
  @ApiOperation({ summary: 'Obtener lecturas históricas de los sensores del dispositivo' })
  @ApiParam({ name: 'id', description: 'ID del dispositivo', type: Number })
  @ApiResponse({ status: 200, description: 'Lecturas históricas obtenidas exitosamente' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para ver estas lecturas' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  async obtenerLecturasHistoricas(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioDecorator() usuario: Usuario,
    @Body('horas') horas?: number
  ) {
    const dispositivo = await this.dispositivosService.repo.findOne({ where: { id } })
    if (!dispositivo) throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`)

    const isAdmin = usuario.roles?.some(rol => rol?.nombre?.toLowerCase() === 'admin') ?? false
    if (!isAdmin && dispositivo.usuarioId !== usuario.id) {
      throw new ForbiddenException('No tiene permiso para ver las lecturas de este dispositivo')
    }

    return this.dispositivosService.obtenerLecturasHistoricas(id, horas || 24)
  }
}
