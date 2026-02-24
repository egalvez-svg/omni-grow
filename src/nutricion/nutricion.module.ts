import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductosModule } from '../productos/productos.module'
import { NutricionSemanal } from './entities/nutricion-semanal.entity'
import { ProductoRiego } from './entities/producto-riego.entity'
import { NutricionController } from './nutricion.controller'
import { NutricionService } from './nutricion.service'
import { CultivosModule } from '../cultivos/cultivos.module'
import { CultivoFasesHistorialModule } from '../cultivo-fases-historial/cultivo-fases-historial.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([NutricionSemanal, ProductoRiego]),
    ProductosModule,
    forwardRef(() => CultivosModule),
    CultivoFasesHistorialModule
  ],
  controllers: [NutricionController],
  providers: [NutricionService],
  exports: [NutricionService]
})
export class NutricionModule { }
