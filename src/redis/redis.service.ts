// src/redis/redis.service.ts
import { Inject, Injectable } from '@nestjs/common'

import { Redis } from 'ioredis'

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value)

    if (!seconds) {
      await this.redisClient.set(key, value)
    } else {
      await this.redisClient.set(key, value, 'EX', seconds)
    }
  }
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key)
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key)
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit()
  }

  public async flushall(): Promise<any> {
    await this.redisClient.flushall()
  }

  async getMany(keys: string[]): Promise<any> {
    return await this.redisClient.mget(keys)
  }
}
