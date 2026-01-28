import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard, ModuleGuard, RequiresModule } from '../shared'

import { ActuadoresService } from './actuadores.service'
import { CreateActuadorDto } from './dto/create-actuador.dto'
import { EjecutarAccionDto } from './dto/ejecutar-accion.dto'
import { UpdateActuadorDto } from './dto/update-actuador.dto'

@ApiTags('Actuadores')
@Controller('actuadores')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequiresModule('dispositivos')
export class ActuadoresController {
  constructor(private readonly actuadoresService: ActuadoresService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo actuador' })
  create(@Body() createDto: CreateActuadorDto) {
    return this.actuadoresService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los actuadores' })
  findAll() {
    return this.actuadoresService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un actuador por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actuadoresService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un actuador' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateActuadorDto) {
    return this.actuadoresService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un actuador' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.actuadoresService.remove(id)
    return { message: 'Actuador eliminado exitosamente' }
  }

  @Post(':id/ejecutar')
  @ApiOperation({ summary: 'Ejecutar acción en un actuador' })
  @ApiParam({ name: 'id', description: 'ID del actuador', type: Number })
  @ApiResponse({ status: 200, description: 'Acción ejecutada exitosamente' })
  @ApiResponse({ status: 404, description: 'Actuador no encontrado' })
  async ejecutarAccion(@Param('id', ParseIntPipe) id: number, @Body() dto: EjecutarAccionDto) {
    return this.actuadoresService.ejecutarAccion(id, dto.accion)
  }
}
