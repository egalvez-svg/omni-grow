import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { ControlPlagasService } from './control-plagas.service'
import { CreateControlPlagaDto } from './dto/create-control-plaga.dto'
import { UpdateControlPlagaDto } from './dto/update-control-plaga.dto'

@ApiTags('Control de Plagas')
@Controller('control-plagas')
@UseGuards(JwtAuthGuard)
export class ControlPlagasController {
    constructor(private readonly controlPlagasService: ControlPlagasService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar una aplicación de control de plagas' })
    @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
    create(@Body() dto: CreateControlPlagaDto) {
        return this.controlPlagasService.create(dto)
    }

    @Get()
    @ApiOperation({ summary: 'Listar registros de control de plagas' })
    @ApiQuery({ name: 'cultivoId', type: Number, required: false, description: 'Filtrar por ID de cultivo' })
    findAll(@Query('cultivoId') cultivoId?: string) {
        return this.controlPlagasService.findAll(cultivoId ? +cultivoId : undefined)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener detalle de un registro de control de plagas' })
    @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.controlPlagasService.findOne(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un registro de control de plagas' })
    @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateControlPlagaDto) {
        return this.controlPlagasService.update(id, dto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un registro de control de plagas' })
    @ApiParam({ name: 'id', description: 'ID del registro', type: Number })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.controlPlagasService.remove(id)
        return { message: 'Registro eliminado exitosamente' }
    }
}
