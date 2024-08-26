import { User } from './../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
export class TokenSender {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  public async sendToken(user: User, res: Response) {
    const accessToken = await this.jwt.signAsync(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwt.signAsync(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    const result = await this.redis.set(
      `user:${user.id}:refresh_token`,
      refreshToken,
    );
    console.log({ result });

    const { password, ...detailUser } = user;
    return { user: detailUser, accessToken };
  }
}
