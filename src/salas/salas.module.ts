import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Dispositivo } from '../dispositivos/entities/dispositivo.entity'
import { Sala } from './entities/sala.entity'
import { SalasController } from './salas.controller'
import { SalasService } from './salas.service'

@Module({
  imports: [TypeOrmModule.forFeature([Sala, Dispositivo])],
  controllers: [SalasController],
  providers: [SalasService],
  exports: [SalasService]
})
export class SalasModule {}
