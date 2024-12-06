import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { dateTime, GuestAt, OwnEvents } from 'src/types/user';
import { phoneRegex } from 'src/utils/regex';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'O username deve conter no máximo 10 caracteres' })
  @MinLength(6, { message: 'O username deve conter no mínimo 6 caracteres' })
  username: string;

  @IsOptional()
  @Matches(phoneRegex, { message: 'Celular deve ser válido' })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser um email' })
  email: string;

  @IsOptional()
  @IsBoolean()
  subscription: boolean;

  @IsOptional()
  guestAt: GuestAt[];

  @IsOptional()
  ownEvents: OwnEvents[];

  @IsOptional()
  createdAt: dateTime;

  @IsOptional()
  updatedAt: dateTime;
}
