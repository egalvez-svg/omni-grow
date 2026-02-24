import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CultivoFaseHistorial } from './entities/cultivo-fase-historial.entity'
import { CultivoFasesHistorialService } from './cultivo-fases-historial.service'

@Module({
    imports: [TypeOrmModule.forFeature([CultivoFaseHistorial])],
    providers: [CultivoFasesHistorialService],
    exports: [CultivoFasesHistorialService, TypeOrmModule]
})
export class CultivoFasesHistorialModule { }
