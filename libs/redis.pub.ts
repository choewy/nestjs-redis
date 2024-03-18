import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisPubOptions } from './interfaces';

@Injectable()
export class RedisPub {
  private readonly logger = new Logger(RedisPub.name);

  constructor(
    private readonly redis: Redis,
    private readonly pubOptions: RedisPubOptions,
  ) {}

  private logging(channel: string, sendMessage: string | object, subscribers: number) {
    if (this.pubOptions.logging === false) {
      return;
    }

    this.logger.debug(JSON.stringify({ subscribers, channel, sendMessage }, null, 2));
  }

  async publish(channel: string | Buffer, message: string | Buffer | object) {
    let targetChannel = channel as string;
    let targetMessage = message as string;

    if (channel instanceof Buffer) {
      targetChannel = channel.toString('utf-8');
    }

    if (message instanceof Buffer) {
      targetMessage = message.toString('utf-8');
    }

    if (message instanceof Object) {
      targetMessage = JSON.stringify(message);
    }

    const subscribers = await this.redis.publish(targetChannel, targetMessage);
    this.logging(targetChannel, targetMessage, subscribers);
  }
}
