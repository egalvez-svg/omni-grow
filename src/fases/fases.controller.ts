import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { FasesService } from './fases.service'
import { FaseCultivo } from './entities/fase-cultivo.entity'

@ApiTags('Fases')
@Controller('fases')
export class FasesController {
    constructor(private readonly fasesService: FasesService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener catálogo de todas las fases activas' })
    async findAll(): Promise<FaseCultivo[]> {
        return this.fasesService.findAll()
    }
}
