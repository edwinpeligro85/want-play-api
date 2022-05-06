import { INestApplication, ValidationPipe } from '@nestjs/common';

export const initValiadtionPipe = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
  }));
};
