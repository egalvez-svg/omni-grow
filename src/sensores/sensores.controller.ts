import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { CreateSensorDto } from './dto/create-sensor.dto'
import { UpdateSensorDto } from './dto/update-sensor.dto'
import { SensoresService } from './sensores.service'

@ApiTags('Sensores')
@Controller('sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo sensor' })
  create(@Body() createDto: CreateSensorDto) {
    return this.sensoresService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los sensores' })
  findAll() {
    return this.sensoresService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un sensor por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sensoresService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un sensor' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSensorDto) {
    return this.sensoresService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un sensor' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sensoresService.remove(id)
    return { message: 'Sensor eliminado exitosamente' }
  }
}
