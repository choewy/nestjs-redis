import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Redis } from 'ioredis';

import { RedisModule } from './redis.module';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6380,
      db: 0,
      pub: { use: true },
      sub: { use: true, channels: ['test'] },
    }),
  ],
})
class AppModule {
  constructor(private readonly redis: Redis) {}

  async onApplicationBootstrap() {
    console.log(this.redis.status);
    console.log(await this.redis.keys('*'));
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
