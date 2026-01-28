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

import { Cama } from '../../camas/entities/cama.entity'
import { Cultivo } from '../../cultivos/entities/cultivo.entity'
import { Dispositivo } from '../../dispositivos/entities/dispositivo.entity'
import { Usuario } from '../../usuario/entities/usuario.entity'

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ length: 150, nullable: true })
  ubicacion?: string

  @Column()
  usuarioId: number

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario

  @OneToMany(() => Dispositivo, d => d.sala)
  dispositivos: Dispositivo[]

  @OneToMany(() => Cama, c => c.sala)
  camas: Cama[]

  @OneToMany(() => Cultivo, c => c.sala)
  cultivos: Cultivo[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date
}
