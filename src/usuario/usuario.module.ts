import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RolModule } from '../rol/rol.module'
import { ModulosModule } from '../modulos/modulos.module'
import { Usuario } from './entities/usuario.entity'
import { UsuarioController } from './usuario.controller'
import { UsuarioService } from './usuario.service'

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), RolModule, ModulosModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule { }
