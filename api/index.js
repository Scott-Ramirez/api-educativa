// Punto de entrada para Vercel Serverless Functions
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function bootstrap() {
  if (!app) {
    try {
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'], // Solo logs importantes
      });
      
      // Habilitar CORS
      app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
      
      await app.init();
    } catch (error) {
      console.error('Bootstrap error:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    // Verificar si las variables de entorno están configuradas
    if (!process.env.DB_HOST) {
      return res.status(500).json({ 
        error: 'Database configuration missing',
        env_check: {
          DB_HOST: !!process.env.DB_HOST,
          DB_USERNAME: !!process.env.DB_USERNAME,
          DB_PASSWORD: !!process.env.DB_PASSWORD,
          DB_NAME: !!process.env.DB_NAME
        }
      });
    }

    const nestApp = await bootstrap();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    
    return expressApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};