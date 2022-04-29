import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Documentation API
  initSwagger(app);

  app.enableCors({
    methods: '*',
    origin: '*',
    allowedHeaders: '*',
    credentials: false,
  });

  await app.listen(3000);
}
bootstrap();
