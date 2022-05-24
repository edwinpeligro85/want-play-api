import { Base } from '@common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Profile } from './profile.schema';

export type FollowerDocument = Follower & Document;

@Schema()
export class Follower extends Base<Follower> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  owner: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  to: Profile;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
