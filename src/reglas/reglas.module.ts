import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MqttModule } from '../mqtt/mqtt.module'

import { ActuadoresModule } from '../actuadores/actuadores.module'
import { SensoresModule } from '../sensores/sensores.module'

import { Regla } from './entities/regla.entity'
import { ReglasController } from './reglas.controller'
import { ReglasService } from './reglas.service'

@Module({
  imports: [TypeOrmModule.forFeature([Regla]), SensoresModule, ActuadoresModule, MqttModule],
  controllers: [ReglasController],
  providers: [ReglasService]
})
export class ReglasModule {}
