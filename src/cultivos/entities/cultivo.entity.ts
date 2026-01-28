import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Cama } from '../../camas/entities/cama.entity'
import { MedioCultivo } from '../../medios-cultivo/entities/medio-cultivo.entity'
import { NutricionSemanal } from '../../nutricion/entities/nutricion-semanal.entity'
import { PlantaPosicion } from '../../plantas/entities/planta-posicion.entity'
import { Sala } from '../../salas/entities/sala.entity'
import { Variedad } from '../../variedad/entities/variedad.entity'

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  nombre: string

  @Column()
  salaId: number

  @ManyToOne(() => Sala, s => s.cultivos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salaId' })
  sala: Sala

  @Column({ nullable: true })
  camaId?: number

  @ManyToOne(() => Cama, c => c.cultivos, { nullable: true })
  @JoinColumn({ name: 'camaId' })
  cama?: Cama

  @Column({ nullable: true })
  medioCultivoId?: number

  @ManyToOne(() => MedioCultivo, m => m.cultivos, { nullable: true })
  @JoinColumn({ name: 'medioCultivoId' })
  medioCultivo?: MedioCultivo

  @ManyToMany(() => Variedad, v => v.cultivos)
  @JoinTable({
    name: 'cultivos_variedades',
    joinColumn: { name: 'cultivoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variedadId', referencedColumnName: 'id' }
  })
  variedades: Variedad[]

  @Column({ type: 'date' })
  fecha_inicio: Date

  @Column({ type: 'date', nullable: true })
  fecha_fin?: Date

  @Column({
    type: 'enum',
    enum: ['esqueje', 'vegetativo', 'floracion', 'cosecha', 'finalizado'],
    default: 'vegetativo'
  })
  estado: 'esqueje' | 'vegetativo' | 'floracion' | 'cosecha' | 'finalizado'

  @Column({ default: 0 })
  cantidad_plantas: number

  @Column({ type: 'text', nullable: true })
  notas?: string

  @OneToMany(() => PlantaPosicion, p => p.cultivo)
  plantas: PlantaPosicion[]

  @OneToMany(() => NutricionSemanal, n => n.cultivo)
  nutricionSemanal: NutricionSemanal[]

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date

  dias_ciclo: number

  @AfterLoad()
  calculateDiasCiclo() {
    if (!this.fecha_inicio) {
      this.dias_ciclo = 0
      return
    }

    const inicio = new Date(this.fecha_inicio)
    const fin = this.fecha_fin ? new Date(this.fecha_fin) : new Date()

    // Ponemos ambas fechas a las 00:00:00 para contar días completos
    inicio.setHours(0, 0, 0, 0)
    fin.setHours(0, 0, 0, 0)

    const diffTime = fin.getTime() - inicio.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    this.dias_ciclo = diffDays >= 0 ? diffDays : 0
  }
}
