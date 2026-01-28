import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Cultivo } from '../../cultivos/entities/cultivo.entity'
import { Variedad } from '../../variedad/entities/variedad.entity'

@Entity('plantas_posicion')
export class PlantaPosicion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cultivoId: number

  @ManyToOne(() => Cultivo, c => c.plantas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultivoId' })
  cultivo: Cultivo

  @Column()
  fila: number // Posición X en la cuadrícula

  @Column()
  columna: number // Posición Y en la cuadrícula

  @Column({ length: 50, nullable: true })
  codigo?: string // Código único para identificar la planta

  @Column({ nullable: true })
  variedadId?: number

  @ManyToOne(() => Variedad, v => v.plantas)
  @JoinColumn({ name: 'variedadId' })
  variedad?: Variedad

  @Column({
    type: 'enum',
    enum: ['activa', 'removida', 'cosechada'],
    default: 'activa'
  })
  estado: 'activa' | 'removida' | 'cosechada'

  @Column({ type: 'date' })
  fecha_plantacion: Date

  @Column({ type: 'text', nullable: true })
  notas?: string

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
