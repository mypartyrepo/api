import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GuestAt, OwnEvents } from 'src/types/user';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  guestAt: GuestAt[];

  @Prop()
  ownEvents: OwnEvents[];

  @Prop()
  subscription: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
