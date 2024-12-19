import { IsObject, IsOptional, IsString } from 'class-validator';
import { EventAddress, EventScreen, Guest } from '../types/event';

export class EventDto {
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
