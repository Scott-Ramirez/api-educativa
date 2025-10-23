const { NestFactory } = require('@nestjs/core');

let app;

async function createNestApp() {
  if (!app) {
    try {
      // Intentar múltiples rutas para AppModule
      let AppModule;
      try {
        AppModule = require('../dist/src/app.module').AppModule;
      } catch (e1) {
        try {
          AppModule = require('../dist/app.module').AppModule;
        } catch (e2) {
          console.error('No se pudo cargar AppModule:', e1.message, e2.message);
          throw new Error(`AppModule no encontrado. Intenté: dist/src/app.module y dist/app.module`);
        }
      }
      
      app = await NestFactory.create(AppModule, {
        logger: console,
      });
      
      app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
      
      app.setGlobalPrefix('api/v1');
      await app.init();
      
      console.log('✅ NestJS App inicializada correctamente');
    } catch (error) {
      console.error('❌ Error inicializando NestJS:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await createNestApp();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Serverless function failed',
      message: error.message,
      debug: {
        __dirname,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV,
        hasDB: !!process.env.DB_HOST
      }
    });
  }
};