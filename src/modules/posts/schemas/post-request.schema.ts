import { TimestampsModel } from '@common/schemas';
import { Profile } from '@modules/profile/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './post.schema';

export type PostRequestDocument = PostRequest & Document;

@Schema({ timestamps: true })
export class PostRequest extends TimestampsModel<PostRequest> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  owner: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  post: Post;
}

export const PostRequestSchema = SchemaFactory.createForClass(PostRequest);
