import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://realtimechat-4uzm.onrender.com',
    credentials: true,
  });

  await app.listen(3001);
  console.log('Backend   is running');
}
bootstrap();
