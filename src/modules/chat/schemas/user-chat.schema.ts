import { TimestampsModel } from '@common/schemas';
import { Profile } from '@modules/profile/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chat } from './chat.schema';

export type UserChatDocument = UserChat & Document;

@Schema({ timestamps: true })
export class UserChat extends TimestampsModel<UserChat> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  owner: Profile;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  })
  chats: Chat[];
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);
