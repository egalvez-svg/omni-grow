import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ControlPlagasController } from './control-plagas.controller'
import { ControlPlagasService } from './control-plagas.service'
import { ControlPlaga } from './entities/control-plaga.entity'
import { ProductoControlPlaga } from './entities/producto-control-plaga.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ControlPlaga, ProductoControlPlaga])],
    controllers: [ControlPlagasController],
    providers: [ControlPlagasService],
    exports: [ControlPlagasService]
})
export class ControlPlagasModule { }
