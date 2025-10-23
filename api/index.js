// Punto de entrada para Vercel Serverless Functions
const { NestFactory } = require('@nestjs/core');

let app;

async function bootstrap() {
  if (!app) {
    try {
      // Intentar múltiples rutas para encontrar AppModule
      let AppModule;
      try {
        AppModule = require('../dist/src/app.module').AppModule;
      } catch (e1) {
        try {
          AppModule = require('../dist/app.module').AppModule;
        } catch (e2) {
          try {
            AppModule = require(__dirname + '/../dist/src/app.module').AppModule;
          } catch (e3) {
            throw new Error(`No se pudo encontrar AppModule. Errores: ${e1.message}, ${e2.message}, ${e3.message}`);
          }
        }
      }
      
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
      });
      
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
    const nestApp = await bootstrap();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      debug: {
        __dirname,
        cwd: process.cwd(),
        env: process.env.NODE_ENV
      }
    });
  }
};