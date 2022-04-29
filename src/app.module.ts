import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config';
import { DatabaseModule } from './database';

@Module({
  imports: [Configuration, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
