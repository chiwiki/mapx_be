import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class ValidatePasswordPipe implements PipeTransform {
  transform(value: ChangePasswordDto, metadata: ArgumentMetadata) {
    const { new_password, confirm_password } = value;
    if (new_password !== confirm_password) {
      throw new BadRequestException(
        'New password and confirm password not match',
      );
    }
    return value;
  }
}
