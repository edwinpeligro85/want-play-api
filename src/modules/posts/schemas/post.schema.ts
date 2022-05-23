import { Base } from '@common/schemas';
import { User } from '@modules/users/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends Base<Post> {
  @Prop()
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const UserSchema = SchemaFactory.createForClass(Post);
