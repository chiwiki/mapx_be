import { IsEmail, IsString, Matches } from 'class-validator';
export class UpdateAccountDto {
  @IsString({ message: 'Username should be a string' })
  username: string;
  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Email invalid' })
  // @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
  //   message: 'Email invalid',
  // })
  email: string;
}
