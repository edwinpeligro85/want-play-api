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
import { UserCreatedListener } from './listeners/user-created.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Follower.name, schema: FollowerSchema },
      { name: Following.name, schema: FollowingSchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserCreatedListener],
})
export class ProfileModule {}
