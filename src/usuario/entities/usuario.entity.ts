import { hash } from 'bcryptjs'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Rol } from '../../rol/entities/rol.entity'
import { Modulo } from '../../modulos/entities/modulo.entity'

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', length: 25, nullable: true })
  nombre: string

  @Column({ type: 'varchar', length: 25, nullable: true })
  apellido_paterno: string

  @Column({ type: 'varchar', length: 25, nullable: false })
  apellido_materno: string

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  usuario: string

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string

  @Column({ type: 'varchar', nullable: true, select: false })
  password: string

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

  @Column({ type: 'text', nullable: true, select: false })
  refresh_token?: string

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  recovery_token?: string

  @Column({ type: 'timestamp', nullable: true, select: false })
  recovery_token_expires?: Date

  @ManyToMany(() => Rol, rol => rol.usuarios, { eager: true })
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'rol_id' }
  })
  roles: Rol[]

  @ManyToMany(() => Modulo, modulo => modulo.usuarios)
  @JoinTable({
    name: 'usuario_modulo',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'modulo_id' }
  })
  modulos: Modulo[]

  @BeforeInsert()
  async hashPasword() {
    if (!this.password) return
    this.password = await hash(this.password, 10)
  }
}
