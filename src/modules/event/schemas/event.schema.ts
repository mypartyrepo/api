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
  dateString: Date;

  @Prop({ required: true })
  CEP: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  guests: Guest[];

  @Prop()
  screens: EventScreen[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
