import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';

import { RedisModuleOptions } from './interfaces';
import { RedisPub } from './redis.pub';
import { RedisSub } from './redis.sub';

@Module({})
export class RedisModule {
  static register({ global, pub, sub, ...redisOptions }: RedisModuleOptions): DynamicModule {
    const providers: Array<Type<any> | Provider> = [
      {
        provide: Redis,
        useFactory() {
          return new Redis(redisOptions);
        },
      },
    ];

    if (pub?.use) {
      providers.push({
        inject: [Redis],
        provide: RedisPub,
        useFactory(redis: Redis) {
          return new RedisPub(redis.duplicate());
        },
      });
    }

    if (sub?.use) {
      providers.push({
        inject: [EventEmitter2, Redis],
        provide: RedisSub,
        useFactory(eventEmitter: EventEmitter2, redis: Redis) {
          return new RedisSub(eventEmitter, redis.duplicate(), sub);
        },
      });
    }

    const dynamicModule: DynamicModule = {
      global,
      imports: [EventEmitterModule.forRoot({ global: false })],
      module: RedisModule,
    };

    if (providers.length > 0) {
      dynamicModule.providers = providers;
      dynamicModule.exports = providers;
    }

    return dynamicModule;
  }
}
