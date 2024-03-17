import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisPub {
  constructor(private readonly redis: Redis) {}
}
