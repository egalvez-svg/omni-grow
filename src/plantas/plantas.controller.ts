import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CreatePlantaPosicionDto } from './dto/create-planta-posicion.dto'
import { UpdatePlantaPosicionDto } from './dto/update-planta-posicion.dto'
import { PlantasService } from './plantas.service'

@ApiTags('Posiciones de Plantas')
@Controller('plantas')
@UseGuards(JwtAuthGuard)
export class PlantasController {
  constructor(private readonly plantasService: PlantasService) {}

  @Post('cultivo/:cultivoId')
  @ApiOperation({ summary: 'Agregar una planta a un cultivo' })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  @ApiResponse({ status: 201, description: 'Planta agregada exitosamente' })
  create(@Param('cultivoId', ParseIntPipe) cultivoId: number, @Body() dto: CreatePlantaPosicionDto) {
    return this.plantasService.create(cultivoId, dto)
  }

  @Get('cultivo/:cultivoId')
  @ApiOperation({ summary: 'Listar todas las plantas de un cultivo' })
  @ApiParam({ name: 'cultivoId', description: 'ID del cultivo', type: Number })
  findAllByCultivo(@Param('cultivoId', ParseIntPipe) cultivoId: number) {
    return this.plantasService.findAllByCultivo(cultivoId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una planta' })
  @ApiParam({ name: 'id', description: 'ID de la planta', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plantasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una planta' })
  @ApiParam({ name: 'id', description: 'ID de la planta', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlantaPosicionDto) {
    return this.plantasService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una planta' })
  @ApiParam({ name: 'id', description: 'ID de la planta', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.plantasService.remove(id)
    return { message: 'Planta eliminada exitosamente' }
  }
}
