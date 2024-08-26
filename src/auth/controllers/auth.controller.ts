import { CreatedResponse, SussessResponse } from './../../core/success';
import { ValidatePasswordPipe } from './../pipes/validate-password.pipe';
import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { ValidateCreateUserPipe } from '../pipes/validate-create-user.pipe';
import { AuthService } from '../services/auth.service';
import { UserMiddle } from 'src/utils/decoraters/user.decorater';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { User } from 'src/entities/user.entity';
import { UserInterceptor } from 'src/utils/interceptors/user.interceptor';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body(ValidateCreateUserPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    console.log({ createUserDto });
    const authResponse = await this.authService.register(createUserDto, res);
    const data = new CreatedResponse(
      'Create user successfully!',
      201,
      authResponse,
    ).send();
    console.log({ data });
    res.json(data);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const authResponse = await this.authService.login(loginDto, res);
    const data = new SussessResponse(
      'Login successfully!',
      200,
      authResponse,
    ).send();

    res.json(data);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: Request, @Res() res: Response) {
    const user_id = request['user'].id;
    console.log({ user_id });

    const result = await this.redis.del(`user:${user_id}:refresh_token`);
    console.log({ result });
    const data = new SussessResponse('Logout successfully!', 200).send();
    return res.status(200).json(data);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Body(ValidatePasswordPipe) changePasswordDto: ChangePasswordDto,
    @UserMiddle() user: { id: string },
  ) {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @Patch('update-account')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @UsePipes(new ValidationPipe())
  async updateAccount(
    @Body() updateAccount: UpdateAccountDto,
    @UserMiddle() user: { id: string },
  ) {
    return this.authService.updateAccount(updateAccount, user);
  }
}
