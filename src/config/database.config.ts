import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getTypeOrmConfig } from './typeorm.config'

export default registerAs('database', () => ({
  config: {
    ...getTypeOrmConfig(false),
    autoLoadEntities: true
  } as TypeOrmModuleOptions
}))
