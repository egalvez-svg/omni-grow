import { DataSourceOptions } from 'typeorm'

export const getTypeOrmConfig = (forCli = false): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    database: process.env.DB_DATABASE ?? 'control-clima',

    entities: forCli ? ['src/**/*.entity.ts'] : ['dist/**/*.entity{.ts,.js}'],

    migrations: forCli ? ['src/migrations/*.ts'] : ['dist/migrations/*{.ts,.js}'],

    synchronize: false,
    logging: forCli ? true : false,
    logger: forCli ? undefined : 'file'
  }
}
