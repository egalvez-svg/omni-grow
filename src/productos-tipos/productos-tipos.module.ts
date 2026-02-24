import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoTipo } from './entities/producto-tipo.entity'
import { ProductosTiposController } from './productos-tipos.controller'
import { ProductosTiposService } from './productos-tipos.service'

@Module({
    imports: [TypeOrmModule.forFeature([ProductoTipo])],
    controllers: [ProductosTiposController],
    providers: [ProductosTiposService],
    exports: [ProductosTiposService]
})
export class ProductosTiposModule { }
