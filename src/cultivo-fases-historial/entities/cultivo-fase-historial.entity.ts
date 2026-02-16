import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('cultivos_fases_historial')
export class CultivoFaseHistorial {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cultivoId: number

    @ManyToOne('Cultivo', (c: any) => c.historialFases, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cultivoId' })
    cultivo: any

    @Column()
    faseId: number

    @ManyToOne('FaseCultivo', (f: any) => f.historiales)
    @JoinColumn({ name: 'faseId' })
    fase: any

    @CreateDateColumn({ type: 'timestamp' })
    fecha_inicio: Date

    @Column({ type: 'timestamp', nullable: true })
    fecha_fin?: Date

    @Column({ type: 'text', nullable: true })
    notas?: string

    @OneToMany('NutricionSemanal', (n: any) => n.faseHistorial)
    riegos: any[]
}
