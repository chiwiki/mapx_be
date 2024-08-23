import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
export class LoginDto {
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Username or email must be a string' })
  login_name: string;

  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password at least 8 characters' })
  @MaxLength(28, { message: 'Password is not greater than 28 characters' })
  password: string;
}
