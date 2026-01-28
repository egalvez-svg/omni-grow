import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LecturasModule } from '../lecturas/lecturas.module'

import { Sensor } from './entities/sensor.entity'
import { SensoresController } from './sensores.controller'
import { SensoresService } from './sensores.service'

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]), forwardRef(() => LecturasModule)],
  controllers: [SensoresController],
  providers: [SensoresService],
  exports: [SensoresService]
})
export class SensoresModule {}
