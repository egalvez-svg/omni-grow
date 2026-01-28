import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CamasService } from './camas.service'
import { CreateCamaDto } from './dto/create-cama.dto'
import { UpdateCamaDto } from './dto/update-cama.dto'

@ApiTags('Camas')
@Controller('camas')
@UseGuards(JwtAuthGuard)
export class CamasController {
  constructor(private readonly camasService: CamasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cama' })
  @ApiResponse({ status: 201, description: 'Cama creada exitosamente' })
  create(@Body() dto: CreateCamaDto) {
    return this.camasService.create(dto)
  }

  @Get('sala/:salaId')
  @ApiOperation({ summary: 'Listar todas las camas de una sala' })
  @ApiParam({ name: 'salaId', description: 'ID de la sala', type: Number })
  findAllBySala(@Param('salaId', ParseIntPipe) salaId: number) {
    return this.camasService.findAllBySala(salaId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una cama' })
  @ApiParam({ name: 'id', description: 'ID de la cama', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.camasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cama' })
  @ApiParam({ name: 'id', description: 'ID de la cama', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCamaDto) {
    return this.camasService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cama' })
  @ApiParam({ name: 'id', description: 'ID de la cama', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.camasService.remove(id)
    return { message: 'Cama eliminada exitosamente' }
  }
}
