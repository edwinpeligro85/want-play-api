import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '@common/schemas';
import { Gender } from '../enums';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends Base<Profile> {
  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;

  @Prop()
  birthDate?: Date;

  @Prop()
  age?: number;

  @Prop(
    raw([
      {
        name: { type: String },
        link: { type: String },
      },
    ]),
  )
  socialMedias: Record<string, string>[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
