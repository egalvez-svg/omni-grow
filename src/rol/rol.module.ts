import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Usuario } from '../usuario/entities/usuario.entity'
import { Rol } from './entities/rol.entity'
import { RolController } from './rol.controller'
import { RolService } from './rol.service'

@Module({
  imports: [TypeOrmModule.forFeature([Rol, Usuario])],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolService]
})
export class RolModule {}
