// Endpoint simple sin TypeORM para probar NestJS básico
const { NestFactory } = require('@nestjs/core');

// Módulo simple sin TypeORM
class SimpleModule {}

let app;

async function createSimpleApp() {
  if (!app) {
    try {
      app = await NestFactory.create(SimpleModule, {
        logger: console,
      });
      
      app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      });
      
      await app.init();
      console.log('✅ Simple NestJS App inicializada');
    } catch (error) {
      console.error('❌ Error inicializando Simple NestJS:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    await createSimpleApp();
    
    return res.status(200).json({
      message: '🎉 ¡API funcionando!',
      timestamp: new Date().toISOString(),
      endpoint: req.url,
      method: req.method,
      environment: process.env.NODE_ENV,
      hasDB: !!process.env.DB_HOST
    });
  } catch (error) {
    console.error('Error en simple endpoint:', error);
    return res.status(500).json({
      error: 'Error en endpoint simple',
      message: error.message
    });
  }
};