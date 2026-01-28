import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Gpio } from '../../gpio/entities/gpio.entity'

@Entity('actuadores')
export class Actuador {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  gpioId: number

  @ManyToOne(() => Gpio, g => g.actuadores)
  @JoinColumn({ name: 'gpioId' })
  gpio: Gpio

  @Column({ length: 50 })
  tipo: string // luz, aire, extractor

  @Column({ default: false })
  estado: boolean

  @Column({ default: true })
  activo: boolean
}
