import { UserService } from './../services/user.service';
import {
  Body,
  Controller,
  Patch,
  Get,
  UseGuards,
  UseInterceptors,
  Param,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

import { UserMiddle } from 'src/utils/decoraters/user.decorater';
import { UserInterceptor } from 'src/utils/interceptors/user.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch('profile')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UserMiddle() user: { id: string },
  ) {
    return this.userService.updateProfile(updateProfileDto, user);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findUserByUsername(username);
  }
}
