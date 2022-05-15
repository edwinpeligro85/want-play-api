import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppServeStaticModule } from './app.serve-static.module';
import { AppService } from './app.service';
import { AppConfigModule } from './config';
import { DatabaseModule } from './database';
import { MailModule } from './mail';
import { FeatureModules } from './modules';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    MailModule,
    EventEmitterModule.forRoot(),
    AppServeStaticModule,
    ...FeatureModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
