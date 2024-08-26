import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Inside guard');
    const request = context.switchToHttp().getRequest<Request>();
    const user_id = request.headers['client_id'];
    if (!user_id) {
      throw new BadRequestException('Missing user id');
    }
    const accessToken = this.extractTokenFromHeader(request);
    const refreshToken = await this.redis.get(`user:${user_id}:refresh_token`);
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to continue');
    }
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
      if (user_id !== decoded.id) {
        throw new BadRequestException('Invalid request');
      }
      request['user'] = { id: decoded.id };
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.updateAccessToken(request, refreshToken);
        return true;
      }
      throw new UnauthorizedException('Token invalid');
    }
  }
  private async updateAccessToken(
    req: any,
    refreshToken: string,
  ): Promise<void> {
    console.log('Update Access Token:::');
    try {
      console.log({ refreshToken });
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      // const user = await this.userRepository.findOne({
      //   where: {
      //     id: decoded.id,
      //   },
      // });
      console.log(decoded);
      const accessToken = this.jwtService.sign(
        { id: decoded.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      );
      console.log({ accessToken });
      req.headers.authorization = 'Bearer ' + accessToken;
      req.user = { id: decoded.id };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Something went wrong. Please login again!',
        );
      }
      console.log('ERROR::', error);
      throw new UnauthorizedException('Token invalid');
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? accessToken : undefined;
  }
}
