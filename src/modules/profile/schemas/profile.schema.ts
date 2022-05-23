import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import { Base } from '@common/schemas';
import { Gender } from '../enums';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile extends Base<Profile> {
  @Prop()
  age?: number;

  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;
}
