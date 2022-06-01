import { TimestampsModel } from '@common/schemas';
import { Profile } from '@modules/profile/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat extends TimestampsModel<Chat> {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  })
  members: Profile[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
