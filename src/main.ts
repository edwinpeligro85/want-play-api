import { Config } from '@config';
import { Logger, ValidationPipe } from '@nestjs/common';
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

  app.setGlobalPrefix(_config.get(Config.API_PREFIX));

  // Automatic Validations
  initValiadtionPipe(app);

  // Swagger Documentation API
  initSwagger(app);

  app.enableCors({
    methods: '*',
    origin: '*',
    allowedHeaders: '*',
    credentials: false,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(_config.get(Config.PORT));

  logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
