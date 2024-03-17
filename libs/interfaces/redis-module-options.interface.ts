import { RedisOptions } from 'ioredis';

export interface RedisPubOptions {
  use: boolean;
}

export interface RedisSubOptions {
  use: boolean;
  channels: string[];
}

export interface RedisModuleOptions extends RedisOptions {
  global?: boolean;
  pub?: RedisPubOptions;
  sub?: RedisSubOptions;
}
