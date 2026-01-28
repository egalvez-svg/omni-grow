import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CreateVariedadDto } from './dto/create-variedad.dto'
import { UpdateVariedadDto } from './dto/update-variedad.dto'
import { VariedadService } from './variedad.service'

@ApiTags('Variedades')
@Controller('variedades')
@UseGuards(JwtAuthGuard)
export class VariedadController {
  constructor(private readonly variedadService: VariedadService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva variedad' })
  @ApiResponse({ status: 201, description: 'Variedad creada exitosamente' })
  create(@Body() dto: CreateVariedadDto) {
    return this.variedadService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las variedades' })
  findAll() {
    return this.variedadService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una variedad' })
  @ApiParam({ name: 'id', description: 'ID de la variedad', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variedadService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una variedad' })
  @ApiParam({ name: 'id', description: 'ID de la variedad', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariedadDto) {
    return this.variedadService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una variedad' })
  @ApiParam({ name: 'id', description: 'ID de la variedad', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.variedadService.remove(id)
    return { message: 'Variedad eliminada exitosamente' }
  }
}
