import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { Cultivo } from '../../cultivos/entities/cultivo.entity'
import { ProductoControlPlaga } from './producto-control-plaga.entity'

@Entity('control_plagas')
export class ControlPlaga {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cultivoId: number

    @ManyToOne(() => Cultivo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cultivoId' })
    cultivo: Cultivo

    @Column({ type: 'date' })
    fecha_aplicacion: Date

    @Column({
        type: 'enum',
        enum: ['foliar', 'riego', 'manual', 'otro'],
        default: 'foliar'
    })
    metodo_aplicacion: 'foliar' | 'riego' | 'manual' | 'otro'

    @Column({ type: 'text', nullable: true })
    notas?: string

    @OneToMany(() => ProductoControlPlaga, pcp => pcp.controlPlaga, { cascade: true })
    productos: ProductoControlPlaga[]

    @CreateDateColumn({ type: 'timestamp' })
    creado_en: Date

    @UpdateDateColumn({ type: 'timestamp' })
    actualizado_en: Date
}
