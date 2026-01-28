import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Gpio } from './entities/gpio.entity'
import { GpioController } from './gpio.controller'
import { GpioService } from './gpio.service'

@Module({
  imports: [TypeOrmModule.forFeature([Gpio])],
  controllers: [GpioController],
  providers: [GpioService]
})
export class GpioModule {}
