import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Sala } from '../salas/entities/sala.entity'
import { Variedad } from '../variedad/entities/variedad.entity'
import { VariedadModule } from '../variedad/variedad.module'
import { MedioCultivo } from '../medios-cultivo/entities/medio-cultivo.entity'
import { CultivosController } from './cultivos.controller'
import { CultivosService } from './cultivos.service'
import { Cultivo } from './entities/cultivo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, Sala, Variedad, MedioCultivo]), VariedadModule],
  controllers: [CultivosController],
  providers: [CultivosService],
  exports: [CultivosService]
})
export class CultivosModule { }
