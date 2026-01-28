import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductoNutricion } from '../../productos/entities/producto-nutricion.entity'
import { NutricionSemanal } from './nutricion-semanal.entity'

@Entity('productos_riego')
export class ProductoRiego {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nutricionSemanalId: number

  @ManyToOne(() => NutricionSemanal, ns => ns.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nutricionSemanalId' })
  nutricionSemanal: NutricionSemanal

  @Column()
  productoNutricionId: number

  @ManyToOne(() => ProductoNutricion, pn => pn.productosRiego)
  @JoinColumn({ name: 'productoNutricionId' })
  productoNutricion: ProductoNutricion

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  dosis_por_litro: number // ml/L o g/L
}
