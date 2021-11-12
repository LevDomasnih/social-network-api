import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
      .setTitle('Social network')
      .setDescription('Social network API ')
      .setVersion('1.0')
      .addTag('API')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);


  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
