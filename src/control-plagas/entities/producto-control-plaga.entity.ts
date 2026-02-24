import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductoNutricion } from '../../productos/entities/producto-nutricion.entity'
import { ControlPlaga } from './control-plaga.entity'

@Entity('productos_control_plaga')
export class ProductoControlPlaga {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    controlPlagaId: number

    @ManyToOne(() => ControlPlaga, cp => cp.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'controlPlagaId' })
    controlPlaga: ControlPlaga

    @Column()
    productoId: number

    @ManyToOne(() => ProductoNutricion)
    @JoinColumn({ name: 'productoId' })
    producto: ProductoNutricion

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    cantidad: number

    @Column({ length: 20, default: 'ml' })
    unidad: string // ml, g, etc.
}
