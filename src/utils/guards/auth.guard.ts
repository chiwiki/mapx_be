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

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Inside guard');
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);
    const { refreshToken } = request.cookies;
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource');
    }
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
      request['user'] = decoded;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.updateAccessToken(request);
        return true;
      }
      throw new UnauthorizedException('Token invalid');
    }
  }
  private async updateAccessToken(req: any): Promise<void> {
    console.log('Update Access Token:::');
    try {
      const refreshTokenData = req.cookies.refreshToken as string;
      const decoded = await this.jwtService.verifyAsync(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const user = await this.userRepository.findOne({
        where: {
          id: decoded.id,
        },
      });
      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      );
      console.log({ accessToken });
      req.headers.authorization = 'Bearer ' + accessToken;
      req.user = { id: user.id };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Something went wrong. Please login again!',
        );
      }
      throw new UnauthorizedException('Token invalid');
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? accessToken : undefined;
  }
}
