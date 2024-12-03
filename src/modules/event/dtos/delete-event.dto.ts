import { IsString } from 'class-validator';

export class DeleteEventDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;
}
