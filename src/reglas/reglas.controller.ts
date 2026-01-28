import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateReglaDto } from './dto/create-regla.dto'
import { UpdateReglaDto } from './dto/update-regla.dto'
import { ReglasService } from './reglas.service'

@ApiTags('Reglas')
@Controller('reglas')
export class ReglasController {
  constructor(private readonly reglasService: ReglasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva regla' })
  create(@Body() createDto: CreateReglaDto) {
    return this.reglasService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las reglas' })
  findAll() {
    return this.reglasService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una regla por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reglasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una regla' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateReglaDto) {
    return this.reglasService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una regla' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reglasService.remove(id)
    return { message: 'Regla eliminada exitosamente' }
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Habilitar/deshabilitar una regla' })
  @ApiParam({ name: 'id', type: Number })
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.reglasService.toggle(id)
  }

  @Get('dispositivo/:id')
  @ApiOperation({ summary: 'Listar todas las reglas segun el dispositivo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Reglas encontradas exitosamente' })
  @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
  findByDispositivo(@Param('id', ParseIntPipe) id: number) {
    return this.reglasService.findByDispositivo(id)
  }
}
