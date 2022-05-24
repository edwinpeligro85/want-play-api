import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '@common/schemas';
import { Gender } from '../enums';
import { SocialMedia } from '../dto/update-profile.dto';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends Base<Profile> {
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

  @Prop({
    _id: false,
    raw: raw([
      {
        link: { type: String },
        name: { type: String },
      },
    ])
  })
  socialMedias: Record<string, any>[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
