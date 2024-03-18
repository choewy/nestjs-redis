import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { OnRedisPub, RedisPubPayloadParam } from '../decorators';
import { RedisPubPayload } from '../implements';
import { RedisModule } from '../redis.module';
import { RedisPub } from '../redis.pub';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6380,
      db: 0,
      pub: { use: true },
      sub: { use: true, channels: ['welcome'] },
    }),
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly redisPub: RedisPub) {}

  async onApplicationBootstrap() {
    await this.redisPub.publish('welcome', { id: 1, value: 'hello' });
  }

  @OnRedisPub('welcome')
  async onRedisPub(@RedisPubPayloadParam() payload: RedisPubPayload) {
    return payload.toJSON();
  }
}
