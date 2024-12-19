import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventScreen, Guest } from '../types/event';

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

  @Prop({ required: true })
  cep: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  addressNumber: string;

  @Prop()
  guests: Guest[];

  @Prop()
  screens: EventScreen[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
