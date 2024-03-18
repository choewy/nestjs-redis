import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { Redis, RedisOptions } from 'ioredis';

import { RedisModuleAsyncOptions, RedisModuleOptions, RedisPubOptions, RedisSubOptions } from './interfaces';
import { RedisPub } from './redis.pub';
import { RedisSub } from './redis.sub';

@Module({})
export class RedisModule {
  private static createProviders(redisOptions: RedisOptions, pubOptions?: RedisPubOptions, subOptions?: RedisSubOptions) {
    const providers: Array<Type<any> | Provider> = [
      {
        provide: Redis,
        useFactory() {
          return new Redis(redisOptions);
        },
      },
    ];

    if (pubOptions?.use) {
      providers.push({
        inject: [Redis],
        provide: RedisPub,
        useFactory(redis: Redis) {
          return new RedisPub(redis.duplicate(), pubOptions);
        },
      });
    }

    if (subOptions?.use) {
      providers.push({
        inject: [Redis, EventEmitter2],
        provide: RedisSub,
        useFactory(redis: Redis, eventEmitter: EventEmitter2) {
          return new RedisSub(redis.duplicate(), subOptions, eventEmitter);
        },
      });
    }

    return providers;
  }

  private static createDynamicModule(providers: Array<Provider | Type<any>>, global?: boolean): DynamicModule {
    return {
      global,
      module: RedisModule,
      imports: [EventEmitterModule.forRoot({ global: false })],
      providers,
      exports: providers,
    };
  }

  static register({ global, pub, sub, ...redisOptions }: RedisModuleOptions): DynamicModule {
    return this.createDynamicModule(this.createProviders(redisOptions, pub, sub), global);
  }

  static async registerAsync(moduleAsyncOptions: RedisModuleAsyncOptions) {
    return this.register(await moduleAsyncOptions.useFactory(...moduleAsyncOptions.inject));
  }
}
