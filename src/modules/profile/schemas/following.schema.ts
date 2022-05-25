import { Base } from '@common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Profile } from './profile.schema';

export type FollowingDocument = Following & Document;

@Schema()
export class Following extends Base<Following> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  following: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  followingOf: Profile;
}

export const FollowingSchema = SchemaFactory.createForClass(Following);
