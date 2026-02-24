import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../shared'
import { CreateProductoTipoDto } from './dto/create-producto-tipo.dto'
import { UpdateProductoTipoDto } from './dto/update-producto-tipo.dto'
import { ProductosTiposService } from './productos-tipos.service'

@ApiTags('Productos Tipos')
@Controller('productos-tipos')
@UseGuards(JwtAuthGuard)
export class ProductosTiposController {
    constructor(private readonly service: ProductosTiposService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo tipo de producto' })
    @ApiResponse({ status: 201, description: 'Tipo creado exitosamente' })
    create(@Body() dto: CreateProductoTipoDto) {
        return this.service.create(dto)
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los tipos de productos' })
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener detalle de un tipo de producto' })
    @ApiParam({ name: 'id', description: 'ID del tipo', type: Number })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un tipo de producto' })
    @ApiParam({ name: 'id', description: 'ID del tipo', type: Number })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoTipoDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un tipo de producto' })
    @ApiParam({ name: 'id', description: 'ID del tipo', type: Number })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.service.remove(id)
        return { message: 'Tipo eliminado exitosamente' }
    }
}
