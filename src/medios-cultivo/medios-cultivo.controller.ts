import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { MediosCultivoService } from './medios-cultivo.service'
import { CreateMedioCultivoDto } from './dto/create-medio-cultivo.dto'
import { UpdateMedioCultivoDto } from './dto/update-medio-cultivo.dto'

@ApiTags('Medios de Cultivo')
@Controller('medios-cultivo')
export class MediosCultivoController {
  constructor(private readonly mediosCultivoService: MediosCultivoService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo medio de cultivo' })
  create(@Body() createMedioCultivoDto: CreateMedioCultivoDto) {
    return this.mediosCultivoService.create(createMedioCultivoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los medios de cultivo disponibles' })
  findAll() {
    return this.mediosCultivoService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un medio de cultivo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediosCultivoService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un medio de cultivo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedioCultivoDto: UpdateMedioCultivoDto) {
    return this.mediosCultivoService.update(id, updateMedioCultivoDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un medio de cultivo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediosCultivoService.remove(id)
  }
}
