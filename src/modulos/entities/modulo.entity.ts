import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Usuario } from '../../usuario/entities/usuario.entity'

@Entity('modulos')
export class Modulo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, unique: true })
    nombre: string

    @Column({ length: 50, unique: true })
    slug: string

    @Column({ type: 'text', nullable: true })
    descripcion?: string

    @Column({ default: true })
    activo: boolean

    @ManyToMany(() => Usuario, usuario => usuario.modulos)
    usuarios: Usuario[]
}
