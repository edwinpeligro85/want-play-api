import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaProvider } from './schemas/user.schema';
import { IsUserAlreadyExist } from './validators';
import { ProfileModule } from '@modules/profile';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([UserSchemaProvider]),
    ProfileModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExist],
  exports: [UsersService],
})
export class UsersModule {}
