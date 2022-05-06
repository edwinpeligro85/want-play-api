import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaProvider } from './esquemas/user.schema';
import { IsUserAlreadyExist } from './validators';

@Module({
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExist],
  exports: [UsersService],
})
export class UsersModule {}
