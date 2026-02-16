import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Sala } from '../salas/entities/sala.entity'
import { Variedad } from '../variedad/entities/variedad.entity'
import { VariedadModule } from '../variedad/variedad.module'
import { CultivosService } from './cultivos.service'
import { MediosCultivoModule } from '../medios-cultivo/medios-cultivo.module'
import { SalasModule } from '../salas/salas.module'
import { MedioCultivo } from '../medios-cultivo/entities/medio-cultivo.entity'
import { CultivosController } from './cultivos.controller'
import { Cultivo } from './entities/cultivo.entity'
import { FasesModule } from '../fases/fases.module'
import { CultivoFasesHistorialModule } from '../cultivo-fases-historial/cultivo-fases-historial.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivo, Sala, Variedad, MedioCultivo]),
    VariedadModule,
    MediosCultivoModule,
    SalasModule,
    FasesModule,
    CultivoFasesHistorialModule
  ],
  controllers: [CultivosController],
  providers: [CultivosService],
  exports: [CultivosService]
})
export class CultivosModule { }
