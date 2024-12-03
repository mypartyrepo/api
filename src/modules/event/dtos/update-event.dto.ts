import { IsString } from 'class-validator';
import { EventDto } from './event.dto';

export class UpdateEventDto extends EventDto {
  @IsString()
  _id: string;
}
