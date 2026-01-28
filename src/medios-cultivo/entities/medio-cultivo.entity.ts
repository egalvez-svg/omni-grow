import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Cultivo } from '../../cultivos/entities/cultivo.entity'

@Entity('medios_cultivo')
export class MedioCultivo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, unique: true })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion: string

  @OneToMany(() => Cultivo, cultivo => cultivo.medioCultivo)
  cultivos: Cultivo[]
}
