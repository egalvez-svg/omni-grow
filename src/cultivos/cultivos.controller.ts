import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CultivosService } from './cultivos.service'
import { CreateCultivoDto } from './dto/create-cultivo.dto'
import { UpdateCultivoDto } from './dto/update-cultivo.dto'

@ApiTags('Cultivos')
@Controller('cultivos')
@UseGuards(JwtAuthGuard)
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cultivo' })
  @ApiResponse({ status: 201, description: 'Cultivo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Sala o variedad no encontrados' })
  create(@Body() dto: CreateCultivoDto) {
    return this.cultivosService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los cultivos' })
  @ApiResponse({ status: 200, description: 'Lista de cultivos' })
  findAll() {
    return this.cultivosService.findAll()
  }

  @Get('activos')
  @ApiOperation({ summary: 'Listar cultivos activos' })
  @ApiResponse({ status: 200, description: 'Lista de cultivos activos (vegetativo, floración, cosecha)' })
  async findActivos() {
    return await this.cultivosService.findActivos()
  }

  @Get('sala/:salaId')
  @ApiOperation({ summary: 'Listar cultivos por sala' })
  @ApiParam({ name: 'salaId', description: 'ID de la sala', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de cultivos de la sala' })
  findBySala(@Param('salaId', ParseIntPipe) salaId: number) {
    return this.cultivosService.findBySala(salaId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cultivo por ID con detalles completos' })
  @ApiParam({ name: 'id', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 200, description: 'Cultivo encontrado con plantas y nutrición' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cultivo' })
  @ApiParam({ name: 'id', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 200, description: 'Cultivo actualizado' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCultivoDto) {
    return this.cultivosService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cultivo' })
  @ApiParam({ name: 'id', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 200, description: 'Cultivo eliminado' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.cultivosService.remove(id)
    return { message: 'Cultivo eliminado exitosamente' }
  }
}
