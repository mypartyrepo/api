import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class ChangePasswordDto {
  @ValidateIf((o) => !o.email && !o.username)
  @IsString()
  userId?: string;

  @ValidateIf((o) => !o.email && !o.userId)
  @IsString()
  username?: string;

  @ValidateIf((o) => !o.username && !o.userId)
  @IsEmail()
  email?: string;

  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}
