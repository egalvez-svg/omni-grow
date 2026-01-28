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

import { Gpio } from '../../gpio/entities/gpio.entity'
import { Regla } from '../../reglas/entities/regla.entity'
import { Sala } from '../../salas/entities/sala.entity'
import { Usuario } from '../../usuario/entities/usuario.entity'

@Entity('dispositivos')
export class Dispositivo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ length: 150, nullable: true })
  ubicacion?: string

  @Column({ length: 45, nullable: true })
  ip?: string

  @Column({ nullable: true })
  usuarioId?: number

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario

  @Column({ nullable: true })
  salaId?: number

  @ManyToOne(() => Sala, s => s.dispositivos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'salaId' })
  sala?: Sala

  @OneToMany(() => Gpio, g => g.dispositivo)
  gpios: Gpio[]

  @OneToMany(() => Regla, r => r.dispositivo)
  reglas: Regla[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
