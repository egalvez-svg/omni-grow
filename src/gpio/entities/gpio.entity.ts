import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Actuador } from '../../actuadores/entities/actuador.entity'
import { Dispositivo } from '../../dispositivos/entities/dispositivo.entity'
import { Sensor } from '../../sensores/entities/sensor.entity'

@Entity('gpio')
export class Gpio {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Dispositivo, d => d.gpios, { eager: false })
  dispositivo: Dispositivo

  @Column()
  pin: number

  @Column({ type: 'enum', enum: ['sensor', 'actuador'] })
  tipo: 'sensor' | 'actuador'

  @Column({ length: 100, nullable: true })
  nombre?: string

  @Column({ default: true })
  activo: boolean

  @OneToMany(() => Sensor, s => s.gpio)
  sensores: Sensor[]

  @OneToMany(() => Actuador, a => a.gpio)
  actuadores: Actuador[]
}
