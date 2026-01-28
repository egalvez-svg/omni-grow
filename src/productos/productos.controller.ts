import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../shared'
import { CreateProductoNutricionDto } from './dto/create-producto-nutricion.dto'
import { UpdateProductoNutricionDto } from './dto/update-producto-nutricion.dto'
import { ProductosService } from './productos.service'

@ApiTags('Productos Nutrición')
@Controller('productos')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto de nutrición' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  create(@Body() dto: CreateProductoNutricionDto) {
    return this.productosService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos de nutrición' })
  @ApiQuery({ name: 'soloActivos', type: Boolean, required: false, description: 'Filtrar solo productos activos' })
  findAll(@Query('soloActivos') soloActivos?: string) {
    return this.productosService.findAll(soloActivos === 'true')
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un producto de nutrición' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto de nutrición' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoNutricionDto) {
    return this.productosService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto de nutrición' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productosService.remove(id)
    return { message: 'Producto eliminado exitosamente' }
  }
}
