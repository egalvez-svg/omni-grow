import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Cultivo } from '../cultivos/entities/cultivo.entity'
import { ProductosModule } from '../productos/productos.module'
import { NutricionSemanal } from './entities/nutricion-semanal.entity'
import { ProductoRiego } from './entities/producto-riego.entity'
import { NutricionController } from './nutricion.controller'
import { NutricionService } from './nutricion.service'

@Module({
  imports: [TypeOrmModule.forFeature([NutricionSemanal, ProductoRiego, Cultivo]), ProductosModule],
  controllers: [NutricionController],
  providers: [NutricionService],
  exports: [NutricionService]
})
export class NutricionModule {}
