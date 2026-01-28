import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Gpio } from '../../gpio/entities/gpio.entity'

@Entity('sensores')
export class Sensor {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ nullable: true })
  gpioId: number

  @ManyToOne(() => Gpio, g => g.sensores)
  @JoinColumn({ name: 'gpioId' })
  gpio?: Gpio

  @Column({ length: 50 })
  tipo: string // temp, humedad, ppm

  @Column({ length: 20 })
  unidad: string // °C, %, ppm

  @Column({ default: true })
  activo: boolean
}
