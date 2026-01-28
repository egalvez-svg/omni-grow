import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Cultivo } from '../../cultivos/entities/cultivo.entity'
import { PlantaPosicion } from '../../plantas/entities/planta-posicion.entity'

@Entity('variedades')
export class Variedad {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ length: 50, nullable: true })
  banco?: string

  @Column({
    type: 'enum',
    enum: ['indica', 'sativa', 'hibrida', 'rudelaris'],
    nullable: true
  })
  tipo?: 'indica' | 'sativa' | 'hibrida' | 'rudelaris'

  @ManyToMany(() => Cultivo, c => c.variedades)
  cultivos: Cultivo[]

  @OneToMany(() => PlantaPosicion, p => p.variedad)
  plantas: PlantaPosicion[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
