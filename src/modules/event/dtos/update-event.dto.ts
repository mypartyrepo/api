import { IsObject, IsOptional, IsString } from 'class-validator';
import { EventDto } from './event.dto';
import { EventAddress, EventScreen, Guest } from '../types/event';

export class UpdateEventDto extends EventDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsObject()
  address: EventAddress;

  @IsOptional()
  guests: Guest[];

  @IsOptional()
  screens: EventScreen[];
}
