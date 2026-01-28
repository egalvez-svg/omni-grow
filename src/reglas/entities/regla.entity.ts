import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Actuador } from '../../actuadores/entities/actuador.entity'
import { Dispositivo } from '../../dispositivos/entities/dispositivo.entity'
import { Sensor } from '../../sensores/entities/sensor.entity'

@Entity('reglas')
export class Regla {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column({ type: 'enum', enum: ['sensor', 'horario'], default: 'sensor' })
  tipo: 'sensor' | 'horario'

  // Campos para reglas basadas en sensores
  @ManyToOne(() => Sensor, { nullable: true })
  sensor?: Sensor

  @Column({ type: 'enum', enum: ['>', '<', '>=', '<=', '='], nullable: true })
  comparador?: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_trigger?: number

  @Column({ type: 'enum', enum: ['encender', 'apagar', 'toggle'], nullable: true })
  accion?: string

  @Column({ type: 'int', default: 0, nullable: true })
  delay_segundos?: number

  @Column({ name: 'horaInicio', type: 'varchar', length: 5, nullable: true })
  hora_inicio?: string // Formato HH:mm

  @Column({ name: 'horaFin', type: 'varchar', length: 5, nullable: true })
  hora_fin?: string // Formato HH:mm

  @Column({ name: 'diasSemana', type: 'json', nullable: true })
  dias_semana?: number[] // [0-6] donde 0=Domingo, 6=Sábado, null=todos los días

  @Column({ name: 'accionInicio', type: 'enum', enum: ['encender', 'apagar'], nullable: true })
  accion_inicio?: 'encender' | 'apagar'

  @Column({ name: 'accionFin', type: 'enum', enum: ['encender', 'apagar'], nullable: true })
  accion_fin?: 'encender' | 'apagar'

  @Column({ nullable: true })
  dispositivoId?: number

  @ManyToOne(() => Dispositivo, d => d.reglas, { nullable: true })
  @JoinColumn({ name: 'dispositivoId' })
  dispositivo?: Dispositivo

  @ManyToOne(() => Actuador)
  actuador: Actuador

  @Column({ default: true })
  habilitada: boolean

  @CreateDateColumn()
  creado_en: Date
}
