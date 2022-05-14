import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config';
import { DatabaseModule } from './database';
import { MailModule } from './mail';
import { FeatureModules } from './modules';

@Module({
  imports: [
    Configuration,
    DatabaseModule,
    MailModule,
    EventEmitterModule.forRoot(),
    ...FeatureModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
