import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Sensor } from '../../sensores/entities/sensor.entity'

@Entity('lecturas')
export class Lectura {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => Sensor)
  @Index()
  sensor: Sensor

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number

  @CreateDateColumn({ type: 'timestamp' })
  registrado_en: Date
}
