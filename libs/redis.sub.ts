import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';

import { createRedisPubEvent } from './constants';
import { OnRedisPubHandlerReturnType } from './decorators/types';
import { RedisPubPayload } from './implements';
import { RedisSubOptions } from './interfaces';

@Injectable()
export class RedisSub implements OnModuleInit {
  private readonly logger = new Logger(RedisSub.name);

  constructor(
    private readonly redis: Redis,
    private readonly subOptions: RedisSubOptions,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private logging(channel: string, receivedMessage: string, results: OnRedisPubHandlerReturnType[]) {
    if (this.subOptions.logging === false) {
      return;
    }

    const total = results.length;
    const errors: unknown[] = [];

    let error = 0;
    let success = 0;

    for (const result of results) {
      if (result.error) {
        error++;
        errors.push({
          context: result.context.getClass()?.name,
          handler: result.context.getHandler()?.name,
          name: result.error.name,
          message: result.error.message,
        });
      } else {
        success++;
      }
    }

    this.logger.debug(JSON.stringify({ channel, receivedMessage, result: { total, error, success } }, null, 2));

    if (error > 0) {
      this.logger.error(JSON.stringify(errors, null, 2));
    }
  }

  private async handleMessage(channel: string, receivedMessage: string) {
    const event = createRedisPubEvent(channel);
    const payload = new RedisPubPayload(channel, receivedMessage);
    const results = await this.eventEmitter.emitAsync(event, payload);

    this.logging(channel, receivedMessage, results);
  }

  async onModuleInit() {
    if (this.subOptions.channels.length > 0) {
      await this.redis.on('message', this.handleMessage.bind(this)).subscribe(...this.subOptions.channels);
    }
  }

  async subscribe(...channels: string[]) {
    await this.redis.subscribe(...channels);
  }

  async unsubscribe() {
    await this.redis.unsubscribe();
  }
}
