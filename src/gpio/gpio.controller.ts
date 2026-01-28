import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateGpioDto } from './dto/create-gpio.dto'
import { UpdateGpioDto } from './dto/update-gpio.dto'
import { GpioService } from './gpio.service'

@ApiTags('GPIO')
@Controller('gpio')
export class GpioController {
  constructor(private readonly gpioService: GpioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo GPIO' })
  @ApiResponse({ status: 201, description: 'GPIO creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDto: CreateGpioDto) {
    return this.gpioService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los GPIO' })
  @ApiQuery({ name: 'dispositivoId', required: false, type: Number, description: 'Filtrar por ID de dispositivo' })
  @ApiResponse({ status: 200, description: 'Lista de GPIO' })
  findAll(@Query('dispositivoId', ParseIntPipe) dispositivoId?: number) {
    return this.gpioService.findAll(dispositivoId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un GPIO por ID' })
  @ApiParam({ name: 'id', description: 'ID del GPIO', type: Number })
  @ApiResponse({ status: 200, description: 'GPIO encontrado' })
  @ApiResponse({ status: 404, description: 'GPIO no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gpioService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un GPIO' })
  @ApiParam({ name: 'id', description: 'ID del GPIO', type: Number })
  @ApiResponse({ status: 200, description: 'GPIO actualizado' })
  @ApiResponse({ status: 404, description: 'GPIO no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateGpioDto) {
    return this.gpioService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un GPIO' })
  @ApiParam({ name: 'id', description: 'ID del GPIO', type: Number })
  @ApiResponse({ status: 200, description: 'GPIO eliminado' })
  @ApiResponse({ status: 404, description: 'GPIO no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.gpioService.remove(id)
    return { message: 'GPIO eliminado exitosamente' }
  }
}
