import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import Redis from 'ioredis'

import { RedisConfig } from '../shared/interfaces'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis')
        if (!redisConfig) {
          throw new Error('Redis configuration is missing!')
        }

        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password
        })
      },
      inject: [ConfigService]
    }
  ],
  exports: ['REDIS_CLIENT']
})
export class RedisModule {}
