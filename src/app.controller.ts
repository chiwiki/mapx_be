import { InjectRedis } from '@nestjs-modules/ioredis';
import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  //http://localhost:3000/
  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redis.keys('user:*');
    console.log(keys);
    return this.appService.getHello();
  }
}
