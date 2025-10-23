// Punto de entrada para Vercel Serverless Functions
const { NestFactory } = require('@nestjs/core');
const path = require('path');

// Usar ruta absoluta para encontrar app.module
const appModulePath = path.join(__dirname, '..', 'dist', 'src', 'app.module');
const { AppModule } = require(appModulePath);

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
      console.error('Trying to load from:', appModulePath);
      console.error('__dirname:', __dirname);
      console.error('process.cwd():', process.cwd());
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
        },
        paths: {
          __dirname,
          cwd: process.cwd(),
          appModulePath
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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      paths: {
        __dirname,
        cwd: process.cwd(),
        appModulePath
      }
    });
  }
};