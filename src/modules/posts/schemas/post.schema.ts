import { TimestampsModel } from '@common/schemas';
import { City } from '@modules/location/schemas';
import { Profile } from '@modules/profile/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';
import { PostRequest } from './post-request.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends TimestampsModel<Post> {
  @Prop({ enum: Object.values(PostStatus), default: PostStatus.OPEN })
  status: PostStatus;

  @Prop({ enum: Object.values(PostType) })
  type: PostType;

  @Prop({ required: true, maxlength: 500 })
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  owner: Profile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: City.name })
  city: City;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostRequest' }],
  })
  requests: PostRequest[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('find', function (next) {
  this.populate('owner city').populate({
    path: 'requests',
    populate: {
      path: 'owner',
      model: 'Profile',
      select: 'nickname',
    },
  });
  next();
});
