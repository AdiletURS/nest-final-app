// apps/auth-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.setGlobalPrefix('api');

  // 1) Берём порт из env и проверяем, что он задан
  const portStr = process.env.AUTH_PORT;
  if (!portStr) {
    throw new Error('Не задана переменная окружения AUTH_PORT');
  }

  // 2) Преобразуем строку в число
  const port = parseInt(portStr, 10);
  if (isNaN(port)) {
    throw new Error(`AUTH_PORT="${portStr}" не является числом`);
  }

  // 3) Стартуем слушать на порту
  await app.listen(port);
}

// Чтобы избавиться от предупреждения "Promise returned from bootstrap is ignored",
// оборачиваем вызов в void (или можно добавить .catch):
void bootstrap();
