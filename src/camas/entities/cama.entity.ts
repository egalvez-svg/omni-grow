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
import { Sala } from '../../salas/entities/sala.entity'

@Entity('camas')
export class Cama {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ default: 0 })
  capacidad_plantas: number

  @Column({ default: 0 })
  filas: number

  @Column({ default: 0 })
  columnas: number

  @Column()
  salaId: number

  @ManyToOne(() => Sala, s => s.camas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salaId' })
  sala: Sala

  @OneToMany(() => Cultivo, c => c.cama)
  cultivos: Cultivo[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
