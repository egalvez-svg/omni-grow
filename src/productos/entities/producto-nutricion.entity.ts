import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ProductoRiego } from '../../nutricion/entities/producto-riego.entity'
import { ProductoTipo } from '../../productos-tipos/entities/producto-tipo.entity'

@Entity('productos_nutricion')
export class ProductoNutricion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ length: 50, nullable: true })
  fabricante?: string

  @Column({ default: true })
  activo: boolean

  @Column()
  tipoId: number

  @ManyToOne(() => ProductoTipo, pt => pt.productos)
  @JoinColumn({ name: 'tipoId' })
  tipo: ProductoTipo

  @OneToMany(() => ProductoRiego, pr => pr.productoNutricion)
  productosRiego: ProductoRiego[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
