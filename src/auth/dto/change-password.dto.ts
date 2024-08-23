import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required!' })
  @MinLength(8, { message: 'Old password at least 8 characters' })
  @MaxLength(28, { message: 'Old password is not greater than 28 characters' })
  old_password: string;
  @IsNotEmpty({ message: 'New password is required!' })
  @MinLength(8, { message: 'New password at least 8 characters' })
  @MaxLength(28, { message: 'New password is not greater than 28 characters' })
  new_password: string;
  @IsNotEmpty({ message: 'Confirm password is required!' })
  @MinLength(8, { message: 'Confirm password at least 8 characters' })
  @MaxLength(28, {
    message: 'Confirm password is not greater than 28 characters',
  })
  confirm_password: string;
}
