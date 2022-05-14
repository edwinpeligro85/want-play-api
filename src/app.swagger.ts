import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Want Play')
    .setDescription(
      `Esta es una API para la realización de encuentros deportivos en tu ciudad. \n 
      Para generar y descargar un archivo JSON Swagger, navegue a http://{{host}}/docs-json
    `,
    )
    .setVersion('1.0')
    .addTag('Soccer, Sport, Shop')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
