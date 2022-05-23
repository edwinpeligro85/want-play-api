import { AuthModule } from './auth';
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
];
