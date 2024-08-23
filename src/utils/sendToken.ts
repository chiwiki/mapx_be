import { User } from './../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export class TokenSender {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
    // console.log({ accessToken });

    const refreshToken = await this.jwt.signAsync(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password, ...detailUser } = user;
    return { user: detailUser, accessToken };
  }
}
