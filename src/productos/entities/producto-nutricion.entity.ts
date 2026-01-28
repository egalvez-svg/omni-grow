import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ProductoRiego } from '../../nutricion/entities/producto-riego.entity'

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

  @OneToMany(() => ProductoRiego, pr => pr.productoNutricion)
  productosRiego: ProductoRiego[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
