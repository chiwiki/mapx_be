import { UserService } from './../services/user.service';
import {
  Body,
  Controller,
  Patch,
  Get,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { User } from 'src/entities/user.entity';
import { UserMiddle } from 'src/utils/decoraters/user.decorater';
import { UserInterceptor } from 'src/utils/interceptors/user.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch('profile')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UserMiddle() user: { id: string },
  ): Promise<User> {
    return this.userService.updateProfile(updateProfileDto, user);
  }

  @Get(':username')
  @UseInterceptors(UserInterceptor)
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findUserByUsername(username);
  }
}
