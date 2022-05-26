import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostRequest, PostRequestSchema, PostSchema } from './schemas';
import { LocationModule } from '@modules/location';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostRequest.name, schema: PostRequestSchema },
    ]),
    LocationModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
