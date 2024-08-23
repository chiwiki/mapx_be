import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required!' })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Email invalid',
  })
  email: string;

  @IsNotEmpty({ message: 'username is required!' })
  @IsString({ message: 'username must be string' })
  username: string;

  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password at least 8 characters' })
  @MaxLength(28, { message: 'Password is not greater than 28 characters' })
  password: string;
}
