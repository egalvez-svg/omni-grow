import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ActuadoresController } from './actuadores.controller'
import { ActuadoresService } from './actuadores.service'
import { Actuador } from './entities/actuador.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Actuador])],
  controllers: [ActuadoresController],
  providers: [ActuadoresService],
  exports: [ActuadoresService]
})
export class ActuadoresModule {}
