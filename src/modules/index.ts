import { AuthModule } from './auth';
import { ChatModule } from './chat';
import { LocationModule } from './location';
import { PostsModule } from './posts';
import { ProfileModule } from './profile';
import { TokenModule } from './token';
import { UsersModule } from './users';

export const FeatureModules = [
  AuthModule,
  TokenModule,
  UsersModule,
  ProfileModule,
  PostsModule,
  LocationModule,
  ChatModule,
];
