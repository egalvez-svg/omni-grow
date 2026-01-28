import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Cultivo } from '../../cultivos/entities/cultivo.entity'

@Entity('ia_analisis')
export class IaAnalisis {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cultivoId: number

  @ManyToOne(() => Cultivo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultivoId' })
  cultivo: Cultivo

  @Column({ type: 'json' })
  snapshot: any // Datos de sensores y riegos en el momento del análisis

  @Column({ type: 'text' })
  analisis: string // El diagnóstico generado por Gemini

  @Column({ type: 'varchar', length: 20, default: 'sensor' })
  origen: 'sensor' | 'manual'

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date
}
