import { RedisOptions } from 'ioredis';

export interface RedisPubOptions {
  use: boolean;
  logging?: boolean;
}

export interface RedisSubOptions {
  use: boolean;
  channels: string[];
  logging?: boolean;
}

export interface RedisModuleOptions extends RedisOptions {
  global?: boolean;
  pub?: RedisPubOptions;
  sub?: RedisSubOptions;
}
