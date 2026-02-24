import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductoNutricion } from '../../productos/entities/producto-nutricion.entity'

@Entity('productos_tipos')
export class ProductoTipo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, unique: true })
    nombre: string // riego, preventivo, control_plagas

    @Column({ type: 'text', nullable: true })
    descripcion?: string

    @OneToMany(() => ProductoNutricion, pn => pn.tipo)
    productos: ProductoNutricion[]
}
