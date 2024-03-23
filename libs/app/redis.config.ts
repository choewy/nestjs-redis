import { registerAs } from '@nestjs/config';
import { RedisModuleOptions } from 'libs/interfaces';

export const REDIS_CONFIG = '__REDIS_CONFIG__';
export const RedisConfig = registerAs(
  REDIS_CONFIG,
  (): RedisModuleOptions => ({
    host: 'localhost',
    port: 6380,
    db: 0,
  }),
);
