import { SussessResponse } from './../../core/success';
import { UpdateProfileDto } from './../dtos/update-profile.dto';
import { Profile } from './../../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { find } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    user: { id: string },
  ) {
    const { id } = user;
    const findUser = await this.userRepository.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (findUser.profile) {
      //   await this.profileRepository
      //     .createQueryBuilder()
      //     .update(Profile)
      //     .set(updateProfileDto)
      //     .where('id = :id', { id: findUser.profile.id })
      //     .execute();

      await this.profileRepository.update(
        findUser.profile.id,
        updateProfileDto,
      );
      const updatedProfile = await this.profileRepository.findOne({
        where: { id: findUser.profile.id },
      });
      findUser.profile = updatedProfile;
    } else {
      const profile = this.profileRepository.create(updateProfileDto);
      const newProfile = await this.profileRepository.save(profile);
      findUser.profile = newProfile;
    }

    const saveUser = await this.userRepository.save(findUser);
    return new SussessResponse('Update profile successfully!', 200, saveUser);
  }
  async findUserByUsername(username: string) {
    const findUser = await this.userRepository.findOne({
      relations: { profile: true },
      where: { username: username },
    });
    if (!findUser) throw new BadRequestException('Username not found');
    return new SussessResponse('Get user by username', 200, findUser.profile);
  }
}
