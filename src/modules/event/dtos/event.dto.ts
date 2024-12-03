import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { EventScreen, Guest } from '../types/event';

export class EventDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  dateString: Date;

  @IsString({ message: 'O CEP deve ser uma string.' })
  @MaxLength(8, { message: 'O CEP deve conter no máximo 8 caracteres.' })
  CEP: string;

  @IsString()
  address: string;

  @IsOptional()
  guests: Guest[];

  @IsOptional()
  screens: EventScreen[];
}
