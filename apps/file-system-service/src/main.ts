import { NestFactory } from '@nestjs/core';
import { FileSystemServiceModule } from './file-system-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FileSystemServiceModule);
  await app.listen(3000);
}
bootstrap();
