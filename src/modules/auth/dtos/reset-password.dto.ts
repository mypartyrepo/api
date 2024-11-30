import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  resetToken: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  newPassword: string;
}
