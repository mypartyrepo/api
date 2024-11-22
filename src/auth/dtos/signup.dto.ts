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
  phoneRegex,
  specialCharRegex,
  uppercaseRegex,
} from 'src/utils/regex';

export class SignupDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(10, { message: 'O username deve conter no máximo 10 caracteres' })
  @MinLength(6, { message: 'O username deve conter no mínimo 6 caracteres' })
  username: string;

  @Matches(phoneRegex, { message: 'Celular deve ser válido' })
  phone: string;

  @IsEmail({}, { message: 'Email deve ser um email' })
  email: string;

  @MaxLength(16, { message: 'A senha deve conter no máximo 16 caracteres' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
  @Matches(uppercaseRegex, {
    message: 'A senha deve conter no mínimo 1 letra maiúscula',
  })
  @Matches(lowercaseRegex, {
    message: 'A senha deve conter no mínimo 1 letra minúscula',
  })
  @Matches(numberRegex, {
    message: 'A senha deve conter no mínimo 1 número',
  })
  @Matches(specialCharRegex, {
    message: 'A senha deve conter no mínimo 1 caracter especial',
  })
  @IsString()
  password: string;
}
