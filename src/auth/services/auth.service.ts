import { SussessResponse } from './../../core/success';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UpdateAccountDto } from './../dto/update-account.dto';
import { ChangePasswordDto } from './../dto/change-password.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenSender } from 'src/utils/sendToken';
import { CreateUserParams } from '../type/create-user.type';
import { User } from 'src/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async register(createUserDto: CreateUserParams, res: Response) {
    const { username, email, password } = createUserDto;

    const findUsername = await this.userRepository.findOneBy({
      username: username,
    });
    console.log({ findUsername });
    if (findUsername) {
      throw new BadRequestException({ message: 'username exist' });
    }
    const findEmail = await this.userRepository.findOneBy({ email });
    if (findEmail) {
      throw new BadRequestException({ message: 'Email exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    if (!savedUser) {
      throw new InternalServerErrorException('Internal error');
    }
    const tokenSender = new TokenSender(
      this.jwtService,
      this.configService,
      this.redis,
    );
    return tokenSender.sendToken(savedUser, res);
  }

  async login(loginDto: LoginDto, res: Response) {
    const { login_name, password } = loginDto;
    const findUser = await this.userRepository.findOne({
      where: [
        {
          username: login_name,
        },
        { email: login_name },
      ],
    });
    if (!findUser) {
      throw new BadRequestException({ message: 'Credential invalid' });
    }
    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
      throw new BadRequestException({ message: 'Credential invalid' });
    }

    const tokenSender = new TokenSender(
      this.jwtService,
      this.configService,
      this.redis,
    );
    return tokenSender.sendToken(findUser, res);
  }
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: { id: string },
  ) {
    const { id } = user;
    const { old_password, new_password } = changePasswordDto;
    const findUser = await this.userRepository.findOne({ where: { id } });
    const isMatch = await bcrypt.compare(old_password, findUser.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.userRepository.update(id, { password: hashedPassword });
    return new SussessResponse('Change password successfully!', 200);
  }
  async updateAccount(updateAccount: UpdateAccountDto, user: { id: string }) {
    const { id } = user;
    const { username, email } = updateAccount;
    const findUserByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (findUserByUsername && findUserByUsername.id !== id) {
      throw new BadRequestException('Username exists');
    }
    const findUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (findUserByEmail && findUserByEmail.id !== id) {
      throw new BadRequestException('Email exists');
    }

    await this.userRepository.update(id, updateAccount);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return new SussessResponse(
      'Update account successfylly!',
      200,
      updatedUser,
    );
  }
}
