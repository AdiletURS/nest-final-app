// apps/auth-service/src/auth-service.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // Делаем ConfigModule доступным во всём приложении
      envFilePath: '.env', // Читаем переменные из файла .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule, чтобы получить ConfigService
      useFactory: (config: ConfigService) => {
        // Получаем обязательные параметры через getOrThrow,
        // чтобы выбросить ошибку на старте, если нужной переменной нет.
        const host = config.getOrThrow('DB_HOST');
        const portStr = config.getOrThrow('DB_PORT');
        const port = parseInt(portStr, 10); // Преобразуем строку в число

        return {
          type: 'postgres',         // Тип БД
          host,                     // Ранее было config.get<string>('DB_HOST')
          port,                     // Ранее parseInt(config.get<string>('DB_PORT'))
          username: config.getOrThrow('DB_USERNAME'), // Ранее config.get<string>('DB_USERNAME')
          password: config.getOrThrow('DB_PASSWORD'), // Ранее config.get<string>('DB_PASSWORD')
          database: config.getOrThrow('DB_DATABASE'), // Ранее config.get<string>('DB_DATABASE')
          autoLoadEntities: true,   // TypeORM сам найдёт все ваши .entity.ts
          synchronize: true,        // Включаем авто-синхронизацию схемы (только для разработки)
        };
      },
      inject: [ConfigService], // Внедряем ConfigService в useFactory
    }),
  ],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
