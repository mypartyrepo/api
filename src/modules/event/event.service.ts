import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Event } from './schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { EventDto } from './dtos/event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { DeleteEventDto } from './dtos/delete-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private EventModel: Model<Event>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async createEvent(userId: string, event: EventDto) {
    const user = await this.UserModel.findById(userId);
    if (!user) throw new BadRequestException('Usuário não encontrado.');
    if (!user.subscription)
      throw new UnauthorizedException(
        'Usuário não possui permissão para criar eventos.',
      );

    const userEventLimit = await this.EventModel.findOne({ userId });
    if (userEventLimit)
      throw new UnauthorizedException(
        'Limite de eventos por usuário atingido.',
      );

    const createdEvent = await this.EventModel.create({ userId, ...event });

    return { message: 'Evento criado com sucesso!', event: createdEvent };
  }

  async findEvent(eventId: string) {
    const event = await this.EventModel.findById(eventId);
    if (!event) throw new BadRequestException('Evento não encontrado.');

    return { message: 'Evento encontrado com sucesso!', event };
  }

  async findEvents(eventIds: string[]) {
    const objectIds = eventIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const events = await this.EventModel.find({ _id: { $in: objectIds } });

    if (events.length === 0) {
      throw new BadRequestException('Nenhum evento encontrado.');
    }

    const foundIds = events.map((event) => event._id.toString());
    const notFoundIds = eventIds.filter((id) => !foundIds.includes(id));

    return {
      message: 'Eventos encontrados com sucesso!',
      foundEvents: events,
      notFoundIds: notFoundIds.length > 0 ? notFoundIds : null,
    };
  }

  async updateEvent(userId: string, event: UpdateEventDto) {
    const { _id } = event;

    const user = await this.UserModel.findById(userId);
    if (!user) throw new BadRequestException('Usuário não encontrado.');
    if (!user.subscription)
      throw new UnauthorizedException(
        'Usuário não possui permissão para alterar eventos.',
      );

    await this.EventModel.findByIdAndUpdate(_id, event);

    return { message: 'Evento atualizado com sucesso!' };
  }

  async deleteEvent(credentials: DeleteEventDto) {
    const { eventId, userId } = credentials;

    const event = await this.EventModel.findById(eventId);
    if (event && event.userId === userId) {
      await this.EventModel.findByIdAndDelete(eventId);
    } else {
      throw new UnauthorizedException('Credenciais incorretas.');
    }

    return { message: 'Evento deletado com sucesso!' };
  }
}
