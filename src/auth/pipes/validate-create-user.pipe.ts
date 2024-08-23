import { CreateUserDto } from './../dto/create-user.dto';

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log('Inside ValidateCreateUserPipe!');
    console.log(value);
    console.log(metadata);
    return value;
  }
}
