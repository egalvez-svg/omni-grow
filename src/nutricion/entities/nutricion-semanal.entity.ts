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
import { ProductoRiego } from './producto-riego.entity'

@Entity('nutricion_semanal')
export class NutricionSemanal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cultivoId: number

  @ManyToOne(() => Cultivo, c => c.nutricionSemanal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultivoId' })
  cultivo: Cultivo

  @Column()
  semana: number // Semana desde el inicio del cultivo

  @Column({ type: 'date' })
  fecha_aplicacion: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  litros_agua: number

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ph?: number

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  ec?: number // Electroconductividad

  @Column({
    type: 'enum',
    enum: ['nutricion', 'solo_agua', 'lavado_raices', 'agua_esquejes'],
    default: 'nutricion'
  })
  tipo_riego: 'nutricion' | 'solo_agua' | 'lavado_raices' | 'agua_esquejes'

  @Column({ type: 'text', nullable: true })
  notas?: string

  @OneToMany(() => ProductoRiego, pr => pr.nutricionSemanal)
  productos: ProductoRiego[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
