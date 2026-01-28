import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MedioCultivo } from './entities/medio-cultivo.entity'
import { MediosCultivoController } from './medios-cultivo.controller'
import { MediosCultivoService } from './medios-cultivo.service'

@Module({
    imports: [TypeOrmModule.forFeature([MedioCultivo])],
    controllers: [MediosCultivoController],
    providers: [MediosCultivoService],
    exports: [MediosCultivoService]
})
export class MediosCultivoModule { }
