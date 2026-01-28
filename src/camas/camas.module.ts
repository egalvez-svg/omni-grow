import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Sala } from '../salas/entities/sala.entity'
import { CamasController } from './camas.controller'
import { CamasService } from './camas.service'
import { Cama } from './entities/cama.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cama, Sala])],
  controllers: [CamasController],
  providers: [CamasService],
  exports: [CamasService]
})
export class CamasModule {}
