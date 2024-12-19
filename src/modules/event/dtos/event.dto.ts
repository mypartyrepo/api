import { IsOptional, IsString, MaxLength } from 'class-validator';
import { EventScreen, Guest } from '../types/event';

export class EventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  @MaxLength(8, { message: 'O CEP deve conter no máximo 8 caracteres.' })
  cep: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  neighborhood: string;

  @IsString()
  street: string;

  @IsString()
  addressNumber: string;

  @IsOptional()
  guests: Guest[];

  @IsOptional()
  screens: EventScreen[];
}
