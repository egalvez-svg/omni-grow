import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CultivoFaseHistorial } from './entities/cultivo-fase-historial.entity'

@Injectable()
export class CultivoFasesHistorialService {
    constructor(
        @InjectRepository(CultivoFaseHistorial)
        private readonly historialRepo: Repository<CultivoFaseHistorial>
    ) { }

    async getActivo(cultivoId: number): Promise<CultivoFaseHistorial | null> {
        return await this.historialRepo.findOne({
            where: { cultivoId, fecha_fin: undefined },
            order: { fecha_inicio: 'DESC' }
        })
    }

    async crear(data: Partial<CultivoFaseHistorial>): Promise<CultivoFaseHistorial> {
        const historial = this.historialRepo.create(data)
        return await this.historialRepo.save(historial)
    }

    async cerrarActivo(cultivoId: number): Promise<void> {
        const activo = await this.getActivo(cultivoId)
        if (activo) {
            activo.fecha_fin = new Date()
            await this.historialRepo.save(activo)
        }
    }
}
