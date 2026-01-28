import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard, ModuleGuard, RequiresModule } from '../shared'
import { IaService } from './ia.service'
import { AnalisisManualDto } from './dto/analisis-manual.dto'

@ApiTags('IA Predictiva')
@Controller('ia')
@UseGuards(JwtAuthGuard, ModuleGuard)
export class IaController {
  constructor(private readonly iaService: IaService) { }

  @Get('analisis/:cultivoId')
  @RequiresModule('dispositivos')
  @ApiOperation({ summary: 'Obtener análisis predictivo del cultivo (Automático)' })
  @ApiResponse({ status: 200, description: 'Análisis generado' })
  async obtenerAnalisis(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return await this.iaService.generarAnalisis(cultivoId)
  }

  @Post('analisis/:cultivoId')
  @ApiOperation({ summary: 'Generar análisis predictivo con datos manuales' })
  @ApiResponse({ status: 200, description: 'Análisis generado' })
  async generarAnalisisManual(
    @Param('cultivoId', ParseIntPipe) cultivoId: number,
    @Body() datos: AnalisisManualDto
  ) {
    return await this.iaService.generarAnalisisManual(cultivoId, datos)
  }

  @Get('snapshot/:cultivoId')
  @ApiOperation({ summary: 'Obtener snapshot de datos crudos para el cultivo' })
  async obtenerSnapshot(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return await this.iaService.getCultivoSnapshot(cultivoId)
  }

  @Get('historial/:cultivoId')
  @ApiOperation({ summary: 'Obtener historial de análisis de IA para el cultivo' })
  async obtenerHistorial(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return await this.iaService.getHistorial(cultivoId)
  }

  @Get('cama/:camaId')
  @ApiOperation({ summary: 'Obtener análisis de IA de todos los cultivos de una cama' })
  async obtenerAnalisisPorCama(@Param('camaId', ParseIntPipe) camaId: number) {
    return await this.iaService.getAnalisisPorCama(camaId)
  }

  @Get('check/:cultivoId')
  @ApiOperation({ summary: 'Verificar si ya existe un análisis para el cultivo hoy' })
  @ApiResponse({ status: 200, description: 'Estado del análisis para hoy' })
  async verificarAnalisisHoy(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return await this.iaService.verificarAnalisisHoy(cultivoId)
  }
}
