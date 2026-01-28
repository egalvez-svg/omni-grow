import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CreateNutricionSemanalDto } from './dto/create-nutricion-semanal.dto'
import { UpdateNutricionSemanalDto } from './dto/update-nutricion-semanal.dto'
import { NutricionService } from './nutricion.service'

@ApiTags('Nutrición')
@Controller('nutricion')
@UseGuards(JwtAuthGuard)
export class NutricionController {
  constructor(private readonly nutricionService: NutricionService) {}

  @Post('cultivo/:cultivoId')
  @ApiOperation({ summary: 'Registrar nutrición semanal para un cultivo' })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 201, description: 'Nutrición registrada exitosamente' })
  addNutricionSemanal(@Param('cultivoId', ParseIntPipe) cultivoId: number, @Body() dto: CreateNutricionSemanalDto) {
    return this.nutricionService.addNutricionSemanal(cultivoId, dto)
  }

  @Get('cultivo/:cultivoId')
  @ApiOperation({ summary: 'Obtener historial de nutrición de un cultivo' })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 200, description: 'Historial de nutrición' })
  findByCultivo(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return this.nutricionService.findByCultivo(cultivoId)
  }

  @Get('cultivo/:cultivoId/semana/:semana')
  @ApiOperation({ summary: 'Obtener nutrición de una semana específica' })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  @ApiParam({ name: 'semana', description: 'Número de semana', type: Number })
  findBySemana(@Param('cultivoId', ParseIntPipe) cultivoId: number, @Param('semana', ParseIntPipe) semana: number) {
    return this.nutricionService.findBySemana(cultivoId, semana)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de nutrición por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nutricionService.findOne(id)
  }

  @Patch(':id/cultivo/:cultivoId')
  @ApiOperation({ summary: 'Actualizar un registro de nutrición' })
  @ApiParam({ name: 'id', description: 'ID del registro de nutrición', type: Number })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('cultivoId', ParseIntPipe) cultivoId: number,
    @Body() dto: UpdateNutricionSemanalDto
  ) {
    return this.nutricionService.update(cultivoId, id, dto)
  }

  @Delete(':id/cultivo/:cultivoId')
  @ApiOperation({ summary: 'Eliminar un registro de nutrición' })
  @ApiParam({ name: 'id', description: 'ID del registro de nutrición', type: Number })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number, @Param('cultivoId', ParseIntPipe) cultivoId: number) {
    await this.nutricionService.remove(cultivoId, id)
    return { message: 'Registro de nutrición eliminado exitosamente' }
  }
}
