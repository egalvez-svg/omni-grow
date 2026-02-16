import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('fases_cultivo')
export class FaseCultivo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, unique: true })
    nombre: string

    @Column({ length: 50, unique: true })
    slug: string

    @Column({ type: 'text', nullable: true })
    descripcion?: string

    @Column({ default: true })
    activo: boolean

    @OneToMany('Cultivo', (cultivo: any) => cultivo.faseActual)
    cultivos: any[]

    @OneToMany('CultivoFaseHistorial', (historial: any) => historial.fase)
    historiales: any[]
}
