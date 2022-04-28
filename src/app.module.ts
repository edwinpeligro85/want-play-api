import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config';

@Module({
  imports: [Configuration],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
