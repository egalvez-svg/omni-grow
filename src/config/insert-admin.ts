import { hash } from 'bcryptjs'
import { DataSource } from 'typeorm'

import { Rol } from '../rol/entities/rol.entity'
import { MessageDto, RolNombre } from '../shared'
import { Usuario } from '../usuario/entities/usuario.entity'
import { dataUsuario } from './data-admin'

export const setDataPerfil = async (dataSource: DataSource): Promise<MessageDto> => {
  const { usuario, email } = dataUsuario
  const _rolRepository = dataSource.getRepository(Rol)
  const _usuarioRepository = dataSource.getRepository(Usuario)

  let adminRole = await _rolRepository.findOne({ where: { nombre: RolNombre.ADMIN } })

  // Si el rol ADMIN no existe, se crea
  if (!adminRole) {
    adminRole = _rolRepository.create({
      nombre: RolNombre.ADMIN,
      creado_por: 1,
      activo: true
    })
    adminRole = await _rolRepository.save(adminRole)
  }

  // Buscar usuario existente con las credenciales dadas (por usuario o email)
  const existingUser = await _usuarioRepository.findOne({
    where: [{ usuario }, { email }]
  })

  if (existingUser) {
    return new MessageDto(`El usuario administrador ${existingUser.usuario} ya existe. No se realizaron cambios.`)
  }

  // Crear un nuevo usuario con el rol ADMIN
  const newUser = _usuarioRepository.create({
    ...dataUsuario,
    creado_por: 1,
    activo: true,
    roles: [adminRole]
  })
  await _usuarioRepository.save(newUser)

  return new MessageDto(`Se agregó el usuario ${newUser.usuario} con rol ${adminRole.nombre}`)
}
