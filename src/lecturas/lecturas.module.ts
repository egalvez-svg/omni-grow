import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SensoresModule } from '../sensores/sensores.module'
import { LecturasMqttService } from './lecturas-mqtt.service'

import { Lectura } from './entities/lectura.entity'
import { LecturasController } from './lecturas.controller'
import { LecturasService } from './lecturas.service'

@Module({
  imports: [TypeOrmModule.forFeature([Lectura]), forwardRef(() => SensoresModule)],
  controllers: [LecturasController],
  providers: [LecturasService, LecturasMqttService],
  exports: [LecturasService]
})
export class LecturasModule {}
