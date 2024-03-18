import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisPub {
  private readonly logger = new Logger(RedisPub.name);

  constructor(private readonly redis: Redis) {}

  async publish(channel: string | Buffer, message: string | Buffer) {
    if (channel instanceof Buffer) {
      channel = channel.toString('utf-8');
    }

    if (message instanceof Buffer) {
      message = message.toString('utf-8');
    }

    const subscribers = await this.redis.publish(channel, message);

    this.logger.debug(
      JSON.stringify(
        {
          message: 'succeed publish message',
          subscribers,
          target: {
            channel,
            message,
          },
        },
        null,
        2,
      ),
    );
  }
}
