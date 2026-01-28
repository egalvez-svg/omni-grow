import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Variedad } from './entities/variedad.entity'
import { VariedadController } from './variedad.controller'
import { VariedadService } from './variedad.service'

@Module({
  imports: [TypeOrmModule.forFeature([Variedad])],
  controllers: [VariedadController],
  providers: [VariedadService],
  exports: [VariedadService]
})
export class VariedadModule {}
