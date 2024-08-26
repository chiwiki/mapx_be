import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
@Module({
  imports: [
    ConfigModule.forRoot(),
    IORedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
})
export class RedisModule {}
