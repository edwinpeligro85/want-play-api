import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { initValiadtionPipe } from './app.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const _config = app.get(ConfigService);
  const logger = new Logger();

  app.enableCors({
    methods: '*',
    origin: '*',
    allowedHeaders: '*',
    credentials: false,
  });

  app.setGlobalPrefix(_config.get<string>('apiPrefix'));

  // Automatic Validations
  initValiadtionPipe(app);

  // Swagger Documentation API
  initSwagger(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(_config.get<number>('port'));

  logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
