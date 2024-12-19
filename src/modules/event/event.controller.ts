import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dtos/event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { DeleteEventDto } from './dtos/delete-event.dto';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  async findEvent(@Param('id') eventId) {
    return await this.eventService.findEvent(eventId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('create')
  async create(@Body() event: EventDto, @Req() req) {
    return await this.eventService.createEvent(req.userId, event);
  }

  @UseGuards(AuthenticationGuard)
  @Put('update')
  async update(@Body() event: UpdateEventDto, @Req() req) {
    return await this.eventService.updateEvent(req.userId, event);
  }

  @UseGuards(AuthenticationGuard)
  @Post('delete')
  async findOne(@Body() credentials: DeleteEventDto) {
    return await this.eventService.deleteEvent(credentials);
  }
}
