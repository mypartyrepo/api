import { Body, Controller, Post, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dtos/event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { DeleteEventDto } from './dtos/delete-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create')
  async create(@Body() event: EventDto) {
    return await this.eventService.createEvent(event);
  }

  @Put('update')
  async update(@Body() event: UpdateEventDto) {
    return await this.eventService.updateEvent(event);
  }

  @Post('delete')
  async findOne(@Body() credentials: DeleteEventDto) {
    return await this.eventService.deleteEvent(credentials);
  }
}
