import { TimestampsModel } from '@common/schemas';
import { Profile } from '@modules/profile/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chat } from './chat.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message extends TimestampsModel<Message> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  from: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true })
  to: Chat;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
