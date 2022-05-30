import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TimestampsModel } from '@common/schemas';
import { Gender } from '../enums';
import { User } from '@modules/users/schemas';
import { City } from '@modules/location/schemas';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends TimestampsModel<Profile> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;

  @Prop()
  birthDate?: Date;

  @Prop()
  age?: number;

  @Prop()
  aboutMe?: string;

  @Prop()
  nickname?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: City.name })
  city?: City;

  @Prop({
    _id: false,
    raw: raw([
      {
        link: { type: String },
        name: { type: String },
      },
    ]),
  })
  socialMedias: Record<string, any>[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
