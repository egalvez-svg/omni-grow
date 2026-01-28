import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CultivosModule } from '../cultivos/cultivos.module'
import { LecturasModule } from '../lecturas/lecturas.module'
import { NutricionModule } from '../nutricion/nutricion.module'
import { IaAnalisis } from './entities/ia-analisis.entity'
import { IaController } from './ia.controller'
import { IaService } from './ia.service'

@Module({
  imports: [TypeOrmModule.forFeature([IaAnalisis]), CultivosModule, NutricionModule, LecturasModule],
  controllers: [IaController],
  providers: [IaService],
  exports: [IaService]
})
export class IaModule {}
