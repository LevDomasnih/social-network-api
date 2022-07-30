import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3020
  const app = await NestFactory.create(AppModule);
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    // Logger.verbose(`Server FILEPARSER started on ${ PORT }`, 'FILEPARSER APPLICATION');
  });
}
bootstrap();
