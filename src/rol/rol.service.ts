import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { MessageDto, RolNombre } from '../shared'

import { CreateRolDto, UpdateRolDto } from './dto'
import { Rol } from './entities/rol.entity'

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly _rolRepository: Repository<Rol>
  ) {}

  async create(dto: CreateRolDto, userId: number): Promise<any> {
    const exists = await this.findOneByName(dto.nombre)
    if (exists) {
      throw new BadRequestException(new MessageDto(`El rol: ${exists.nombre} ya existe`))
    }

    const rol = this._rolRepository.create({
      ...dto,
      creado_por: userId,
      activo: true
    })
    const savedRol = await this._rolRepository.save(rol)
    return new MessageDto(`Rol creado exitosamente ${savedRol.nombre}`)
  }

  async findOneByName(nombre: RolNombre): Promise<Rol | null> {
    return this._rolRepository.findOne({
      where: { activo: true, nombre }
    })
  }

  async findAll(): Promise<Rol[]> {
    const roles = await this._rolRepository.find({
      where: { activo: true },
      order: { id: 'ASC' }
    })

    if (!roles.length) {
      throw new NotFoundException(new MessageDto('No hay roles en la lista'))
    }

    return roles
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this._rolRepository.findOne({
      where: { activo: true, id }
    })

    if (!rol) {
      throw new NotFoundException(new MessageDto(`No existe información para el ID ${id}`))
    }

    return rol
  }

  async update(id: number, updateRolDto: UpdateRolDto, userId: number): Promise<Rol> {
    const rol = await this.findOne(id)
    Object.assign(rol, updateRolDto, { modificado_por: userId })
    return this._rolRepository.save(rol)
  }

  async remove(id: number, userId: number): Promise<string> {
    const rol = await this.findOne(id)
    rol.activo = false
    rol.modificado_por = userId

    await this._rolRepository.save(rol)
    return `Se ha eliminado el rol ${rol.nombre}`
  }
}
