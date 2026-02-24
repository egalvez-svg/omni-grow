import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductosTiposModule } from '../productos-tipos/productos-tipos.module'

import { ProductoNutricion } from './entities/producto-nutricion.entity'
import { ProductosController } from './productos.controller'
import { ProductosService } from './productos.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoNutricion]),
    ProductosTiposModule
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService]
})
export class ProductosModule { }
