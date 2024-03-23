import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_CONFIG, RedisConfig } from './redis.config';
import { OnRedisPub, RedisPubPayloadParam } from '../decorators';
import { RedisPubPayload } from '../implements';
import { RedisModule } from '../redis.module';
import { RedisPub } from '../redis.pub';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [RedisConfig],
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          ...configService.get(REDIS_CONFIG),
          pub: { use: true },
          sub: { use: true, channels: ['welcome'] },
        };
      },
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
