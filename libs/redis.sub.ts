import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';

import { createRedisEvent } from './constants';
import { RedisSubOptions } from './interfaces';

@Injectable()
export class RedisSub implements OnModuleInit {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redis: Redis,
    private readonly subOptions: RedisSubOptions,
  ) {}

  private async handleMessage(channel: string, message: string) {
    const event = createRedisEvent(channel);
    const result = await this.eventEmitter.emitAsync(event, message);

    console.log({ result, channel, message });
  }

  async onModuleInit() {
    if (this.subOptions.channels.length > 0) {
      await this.redis.on('message', this.handleMessage.bind(this)).subscribe(...this.subOptions.channels);
    }
  }
}
