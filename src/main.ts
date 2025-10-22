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

  // Middleware para logging de requests de imágenes ANTES de servir archivos
  app.use('/uploads', (req, res, next) => {
    Logger.log(`🖼️ Request de imagen: ${req.method} ${req.url}`);
    Logger.log(`🔍 Headers: ${JSON.stringify(req.headers)}`);
    next();
  });

  // Servir archivos estáticos para imágenes con opciones específicas
  const uploadsPath = join(__dirname, '..', 'uploads');
  Logger.log(`📁 Sirviendo archivos estáticos desde: ${uploadsPath}`);
  
  app.use('/uploads', express.static(uploadsPath, {
    // Configurar headers para compatibility con vercel
    setHeaders: (res, path) => {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Type': path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg' : 
                       path.endsWith('.png') ? 'image/png' : 
                       path.endsWith('.gif') ? 'image/gif' : 'application/octet-stream'
      });
      Logger.log(`� Sirviendo archivo: ${path}`);
    }
  }));

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

  // Puerto dinámico para Vercel
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
