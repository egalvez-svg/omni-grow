import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { RolNombre } from '../../shared/enums'
import { Usuario } from '../../usuario/entities/usuario.entity'

@Entity({ name: 'rol' })
export class Rol {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    type: 'enum',
    enum: RolNombre
  })
  nombre: RolNombre

  @Column({ select: false, nullable: true })
  creado_por?: number

  @CreateDateColumn({ type: 'timestamp', select: false })
  fecha_creacion!: Date

  @Column({ select: false, nullable: true })
  modificado_por?: number

  @UpdateDateColumn({ type: 'timestamp', select: false })
  fecha_modificacion: Date

  @Column({ default: true, select: false })
  activo?: boolean

  @ManyToMany(() => Usuario, usuario => usuario.roles)
  usuarios: Usuario[]
}
