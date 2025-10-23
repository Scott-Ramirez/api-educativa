const { NestFactory } = require('@nestjs/core');

let app;

async function createNestApp() {
  if (!app) {
    try {
      // Intentar múltiples rutas para AppModule basado en el directorio de trabajo
      let AppModule;
      const paths = [
        '../dist/src/app.module',
        '../dist/app.module', 
        '/var/task/dist/src/app.module',
        './dist/src/app.module',
        'dist/src/app.module'
      ];
      
      let lastError;
      for (const modulePath of paths) {
        try {
          console.log(`Intentando cargar desde: ${modulePath}`);
          AppModule = require(modulePath).AppModule;
          console.log(`✅ AppModule cargado exitosamente desde: ${modulePath}`);
          break;
        } catch (error) {
          console.log(`❌ Falló ${modulePath}: ${error.message}`);
          lastError = error;
        }
      }
      
      if (!AppModule) {
        throw new Error(`AppModule no encontrado en ninguna ruta. Último error: ${lastError.message}`);
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