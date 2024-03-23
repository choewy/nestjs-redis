import { ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

import { RedisPubOptions } from './redis-pub-options.interface';
import { RedisSubOptions } from './redis-sub-options.interface';

export interface RedisModuleOptions extends RedisOptions {
  pub?: RedisPubOptions;
  sub?: RedisSubOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
