import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateLecturaDto } from './dto/create-lectura.dto'
import { LecturasService } from './lecturas.service'

@ApiTags('Lecturas')
@Controller('lecturas')
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva lectura' })
  @ApiResponse({ status: 201, description: 'Lectura registrada exitosamente' })
  create(@Body() createDto: CreateLecturaDto) {
    return this.lecturasService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar lecturas con filtros opcionales' })
  @ApiQuery({ name: 'sensorId', required: false, type: Number, description: 'Filtrar por ID de sensor' })
  @ApiQuery({ name: 'fechaInicio', required: false, type: String, description: 'Fecha inicio (ISO 8601)' })
  @ApiQuery({ name: 'fechaFin', required: false, type: String, description: 'Fecha fin (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Lista de lecturas (últimas 100)' })
  findAll(
    @Query('sensorId') sensorId?: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined
    const fin = fechaFin ? new Date(fechaFin) : undefined

    return this.lecturasService.findAll(sensorId, inicio, fin)
  }

  @Get('sensor/:sensorId/ultima')
  @ApiOperation({ summary: 'Obtener la última lectura de un sensor' })
  @ApiParam({ name: 'sensorId', type: Number, description: 'ID del sensor' })
  @ApiResponse({ status: 200, description: 'Última lectura del sensor' })
  @ApiResponse({ status: 404, description: 'No se encontraron lecturas' })
  getUltima(@Param('sensorId', ParseIntPipe) sensorId: number) {
    return this.lecturasService.obtenerUltimaLectura(sensorId)
  }

  @Get('sensor/:sensorId')
  @ApiOperation({ summary: 'Obtener lecturas de un sensor específico' })
  @ApiParam({ name: 'sensorId', type: Number, description: 'ID del sensor' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de lecturas a retornar (default: 50)'
  })
  @ApiResponse({ status: 200, description: 'Lista de lecturas del sensor' })
  getBySensor(@Param('sensorId', ParseIntPipe) sensorId: number, @Query('limit') limit?: number) {
    return this.lecturasService.findBySensor(sensorId, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lectura por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lectura encontrada' })
  @ApiResponse({ status: 404, description: 'Lectura no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lecturasService.findOne(id)
  }
}
