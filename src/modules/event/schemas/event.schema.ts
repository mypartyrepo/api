import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventAddress, EventScreen, Guest } from '../types/event';

@Schema({ versionKey: false, timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, type: Object })
  address: EventAddress;

  @Prop({ type: [Object], default: [] })
  guests: Guest[];

  @Prop({ type: [Object], default: [] })
  screens: EventScreen[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
