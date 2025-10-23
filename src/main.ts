import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }
  });

  // Prefijo global
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración Swagger solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Educativa')
      .setDescription('Documentación de la API del sistema educativo')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // Puerto dinámico para desarrollo
  const configService = app.get(ConfigService);
  const port = Number(process.env.PORT || configService.get('PORT') || 3000);

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Servidor en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    Logger.log(`📘 Swagger: http://localhost:${port}/api-docs`);
  }
}

bootstrap();
