import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config';
import { DatabaseModule } from './database';
import { FeatureModules } from './modules';

@Module({
  imports: [Configuration, DatabaseModule, ...FeatureModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
