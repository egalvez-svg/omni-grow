import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ClimaController } from './clima.controller'
import { ClimaService } from './clima.service'

@Module({
  imports: [HttpModule],
  controllers: [ClimaController],
  providers: [ClimaService]
})
export class ClimaModule {}
