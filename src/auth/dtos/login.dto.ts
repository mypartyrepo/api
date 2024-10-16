import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.email)
  @IsString()
  username?: string;

  @ValidateIf((o) => !o.username)
  @IsEmail()
  email?: string;

  @IsString()
  password: string;
}
