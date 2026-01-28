import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LecturasModule } from '../lecturas/lecturas.module'
import { DispositivosController } from './dispositivos.controller'
import { DispositivosService } from './dispositivos.service'
import { Dispositivo } from './entities/dispositivo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Dispositivo]), LecturasModule],
  controllers: [DispositivosController],
  providers: [DispositivosService]
})
export class DispositivosModule {}
