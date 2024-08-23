import { ValidatePasswordPipe } from './../pipes/validate-password.pipe';
import {
  Body,
  Controller,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body(ValidateCreateUserPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    console.log({ createUserDto });
    const authResponse = await this.authService.register(createUserDto, res);
    res.json(authResponse);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const authResponse = await this.authService.login(loginDto, res);
    res.json(authResponse);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    return res.send({ message: 'Logged out successfully' });
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Body(ValidatePasswordPipe) changePasswordDto: ChangePasswordDto,
    @UserMiddle() user: { id: string },
  ): Promise<Record<string, string>> {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @Patch('update-account')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @UsePipes(new ValidationPipe())
  async updateAccount(
    @Body() updateAccount: UpdateAccountDto,
    @UserMiddle() user: { id: string },
  ): Promise<User> {
    return this.authService.updateAccount(updateAccount, user);
  }
}
