import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Follower,
  FollowerSchema,
  Following,
  FollowingSchema,
  Profile,
  ProfileSchema,
} from './schemas';
import { PostsModule } from '@modules/posts';
import { LocationModule } from '@modules/location';
import { ChatModule } from '@modules/chat';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Follower.name, schema: FollowerSchema },
      { name: Following.name, schema: FollowingSchema },
    ]),
    PostsModule,
    LocationModule,
    ChatModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
