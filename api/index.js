// Punto de entrada para Vercel Serverless Functions
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

let server;

async function createNestServer() {
  if (!server) {
    try {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      
      server = await NestFactory.create(AppModule, adapter, {
        logger: false, // Desactivar logs en producción para evitar conflictos
      });
      
      // Habilitar CORS
      server.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
      
      // Configurar el prefijo global
      server.setGlobalPrefix('api');
      
      await server.init();
    } catch (error) {
      console.error('Error creating NestJS server:', error);
      throw error;
    }
  }
  return server;
}

module.exports = async (req, res) => {
  try {
    const app = await createNestServer();
    const expressApp = app.getHttpAdapter().getInstance();
    
    // Asegurar que express maneje la request
    expressApp(req, res);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};