import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { Profile } from 'src/entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
