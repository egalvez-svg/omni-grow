import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm'

import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'

import { RolService } from '../rol/rol.service'
import { ModulosService } from '../modulos/modulos.service'
import { MessageDto, TOKEN_EXPIRE } from '../shared'

import { CreateUsuarioDto, SetRolDto, UpdateUsuarioDto, SetModulosDto } from './dto/'
import { Usuario } from './entities/usuario.entity'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly _usuarioRepository: Repository<Usuario>,
    private readonly _rolService: RolService,
    private readonly _modulosService: ModulosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto, userId: number) {
    const { usuario, email } = createUsuarioDto

    const exists = await this.findOneByNameEmail(usuario, email)
    if (exists) {
      throw new BadRequestException(new MessageDto(`El usuario: ${exists.nombre} ya existe`))
    }

    const usuarios = this._usuarioRepository.create({
      ...createUsuarioDto,
      creado_por: userId,
      activo: true
    })
    const savedUsuario = await this._usuarioRepository.save(usuarios)
    return new MessageDto(`Usuario creado exitosamente ${savedUsuario.usuario}`)
  }

  async findAll() {
    const usuarios = await this._usuarioRepository.find({
      where: { activo: true },
      relations: ['roles', 'modulos'],
      order: { id: 'ASC' }
    })

    if (!usuarios.length) {
      throw new NotFoundException(new MessageDto('No hay usuarios en la lista'))
    }

    return usuarios
  }

  async findOne(id: number) {
    const usuario = await this._usuarioRepository.findOne({
      where: { activo: true, id },
      relations: ['roles', 'modulos']
    })

    if (!usuario) {
      throw new NotFoundException(new MessageDto(`No existe información para el ID ${id}`))
    }

    return usuario
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto, userId: number): Promise<any> {
    const usuario = await this.findOne(id)

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await hash(updateUsuarioDto.password, 10)
    }

    Object.assign(usuario, updateUsuarioDto, { modificado_por: userId })
    const updatedUser = await this._usuarioRepository.save(usuario)
    const token = await this.generateToken(updatedUser)
    return { ...updatedUser, ...token }
  }

  async remove(id: number, userId: number) {
    const usuario = await this.findOne(id)
    usuario.activo = false
    usuario.modificado_por = userId

    await this._usuarioRepository.save(usuario)
    return new MessageDto(`Se ha eliminado el rol ${usuario.nombre}`)
  }

  async findOneByNameEmail(usuario: string, email: string): Promise<Usuario | null> {
    return this._usuarioRepository.findOne({
      where: { activo: true, usuario: usuario, email: email }
    })
  }

  async setRol(id: number, rolDto: SetRolDto) {
    const { rol_ids } = rolDto

    // Validar que todos los roles existan
    const roles = await Promise.all(
      rol_ids.map(async rol_id => {
        const rol = await this._rolService.findOne(rol_id)
        return rol
      })
    )

    const usuario = await this.findOne(id)
    usuario.roles = roles

    await this._usuarioRepository.save(usuario)

    const roleNames = roles.map(r => r.nombre).join(', ')
    const token = await this.generateToken(usuario)

    return {
      message: `Se asignaron los roles [${roleNames}] al usuario ${usuario.usuario}`,
      ...token
    }
  }

  async setModulos(id: number, modulosDto: SetModulosDto) {
    const { moduloIds } = modulosDto

    // Validar que todos los módulos existan
    const modulos = await Promise.all(
      moduloIds.map(async moduloId => {
        const modulo = await this._modulosService.findOne(moduloId)
        return modulo
      })
    )

    const usuario = await this.findOne(id)
    usuario.modulos = modulos

    await this._usuarioRepository.save(usuario)

    const moduloNames = modulos.map(m => m.nombre).join(', ')
    const token = await this.generateToken(usuario) // Generar nuevo token con permisos actualizados

    return {
      message: `Se asignaron los módulos [${moduloNames}] al usuario ${usuario.usuario}`,
      ...token
    }
  }

  private async generateToken(user: Usuario) {
    const payload = {
      id: user.id,
      usuario: user.usuario,
      email: user.email,
      roles: user.roles.map(r => r.nombre),
      modulos: user.modulos.map(m => ({ slug: m.slug }))
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(TOKEN_EXPIRE) || '15m'
    })

    return { accessToken }
  }
}
