import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Cultivo } from '../cultivos/entities/cultivo.entity'
import { VariedadModule } from '../variedad/variedad.module'
import { PlantaPosicion } from './entities/planta-posicion.entity'
import { PlantasController } from './plantas.controller'
import { PlantasService } from './plantas.service'

@Module({
  imports: [TypeOrmModule.forFeature([PlantaPosicion, Cultivo]), VariedadModule],
  controllers: [PlantasController],
  providers: [PlantasService],
  exports: [PlantasService]
})
export class PlantasModule {}
