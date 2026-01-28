import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModulosService } from './modulos.service';
import { CreateModuloDto, UpdateModuloDto } from './dto/modulos.dto';
import { JwtAuthGuard } from '../shared';

@ApiTags('Módulos del Sistema')
@Controller('modulos')
@UseGuards(JwtAuthGuard)
export class ModulosController {
    constructor(private readonly modulosService: ModulosService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo módulo' })
    create(@Body() createModuloDto: CreateModuloDto) {
        return this.modulosService.create(createModuloDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los módulos' })
    findAll() {
        return this.modulosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un módulo por ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.modulosService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un módulo' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateModuloDto: UpdateModuloDto) {
        return this.modulosService.update(id, updateModuloDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un módulo' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.modulosService.remove(id);
    }
}
