import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';

import { RedisModuleAsyncOptions, RedisModuleOptions } from './interfaces';
import { RedisPub } from './redis.pub';
import { RedisSub } from './redis.sub';

@Module({})
export class RedisModule {
  static forRoot({ pub, sub, ...redisOptions }: RedisModuleOptions): DynamicModule {
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
          return new RedisPub(redis.duplicate(), pub);
        },
      });
    }

    if (sub?.use) {
      providers.push({
        inject: [Redis, EventEmitter2],
        provide: RedisSub,
        useFactory(redis: Redis, eventEmitter: EventEmitter2) {
          return new RedisSub(redis.duplicate(), sub, eventEmitter);
        },
      });
    }

    return {
      global: true,
      module: RedisModule,
      imports: [EventEmitterModule.forRoot({ global: false })],
      providers,
      exports: providers,
    };
  }

  static async forRootAsync(moduleAsyncOptions: RedisModuleAsyncOptions) {
    const providers: Array<Type<any> | Provider> = [
      {
        provide: Redis,
        inject: moduleAsyncOptions.inject,
        async useFactory(...dependencies) {
          const options = await moduleAsyncOptions.useFactory(...dependencies);
          return new Redis(options);
        },
      },
      {
        provide: RedisPub,
        inject: [Redis, ...moduleAsyncOptions.inject],
        async useFactory(redis, ...dependencies) {
          const options = await moduleAsyncOptions.useFactory(...dependencies);

          if (options.pub?.use) {
            return new RedisPub(redis, options.pub);
          }
        },
      },
      {
        provide: RedisSub,
        inject: [Redis, EventEmitter2, ...moduleAsyncOptions.inject],
        async useFactory(redis: Redis, eventEmitter, ...dependencies) {
          const options = await moduleAsyncOptions.useFactory(...dependencies);

          if (options.sub?.use) {
            return new RedisSub(redis.duplicate(), options.sub, eventEmitter);
          }
        },
      },
    ];

    return {
      global: true,
      module: RedisModule,
      imports: [EventEmitterModule.forRoot({ global: false })],
      providers,
      exports: providers,
    };
  }
}
