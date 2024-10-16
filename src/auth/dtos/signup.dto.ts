import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  lowercaseRegex,
  numberRegex,
  specialCharRegex,
  uppercaseRegex,
} from 'src/utils/regex';

export class SignupDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(9, { message: 'Username must contain 9 characters maximum' })
  @MinLength(6, { message: 'Username must contain 6 characters minimum' })
  username: string;

  @IsEmail()
  email: string;

  @MaxLength(16, { message: 'Password must contain 16 characters maximum' })
  @MinLength(8, { message: 'Password must contain 8 characters minimum' })
  @Matches(uppercaseRegex, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(lowercaseRegex, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(numberRegex, {
    message: 'Password must contain at least one number',
  })
  @Matches(specialCharRegex, {
    message: 'Password must contain at least one special character',
  })
  @IsString()
  password: string;
}
