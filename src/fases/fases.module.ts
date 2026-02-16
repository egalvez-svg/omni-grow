import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FaseCultivo } from './entities/fase-cultivo.entity'
import { FasesService } from './fases.service'
import { FasesController } from './fases.controller'

@Module({
    imports: [TypeOrmModule.forFeature([FaseCultivo])],
    controllers: [FasesController],
    providers: [FasesService],
    exports: [FasesService, TypeOrmModule]
})
export class FasesModule { }
