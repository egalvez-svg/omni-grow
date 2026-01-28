import { Global, Module } from '@nestjs/common'

import { LoggerModule } from '../logger/logger.module'
import { MqttService } from './mqtt.service'

@Global()
@Module({
  imports: [LoggerModule],
  providers: [MqttService],
  exports: [MqttService]
})
export class MqttModule {}
