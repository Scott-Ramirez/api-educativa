const { NestFactory } = require('@nestjs/core');

let app;

async function createNestApp() {
  if (!app) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // DEBUGGING: Primero listar toda la estructura de archivos
      let fileStructure = {};
      try {
        fileStructure.rootFiles = fs.readdirSync('/var/task');
        console.log('📂 /var/task:', fileStructure.rootFiles);
        
        if (fileStructure.rootFiles.includes('dist')) {
          fileStructure.distFiles = fs.readdirSync('/var/task/dist');
          console.log('� /var/task/dist:', fileStructure.distFiles);
          
          if (fileStructure.distFiles.includes('src')) {
            fileStructure.distSrcFiles = fs.readdirSync('/var/task/dist/src');
            console.log('📂 /var/task/dist/src:', fileStructure.distSrcFiles);
          }
        }
      } catch (e) {
        fileStructure.error = e.message;
      }
      
      // Buscar carpeta build en lugar de dist
      if (!fileStructure.rootFiles || !fileStructure.rootFiles.includes('build')) {
        throw new Error(`No se encontró carpeta build. Estructura: ${JSON.stringify(fileStructure)}`);
      }
      
      // Explorar contenido de build
      fileStructure.buildFiles = fs.readdirSync('/var/task/build');
      console.log('📂 /var/task/build:', fileStructure.buildFiles);
      
      if (fileStructure.buildFiles.includes('dist')) {
        fileStructure.buildDistFiles = fs.readdirSync('/var/task/build/dist');
        console.log('📂 /var/task/build/dist:', fileStructure.buildDistFiles);
        
        if (fileStructure.buildDistFiles.includes('src')) {
          fileStructure.buildDistSrcFiles = fs.readdirSync('/var/task/build/dist/src');
          console.log('📂 /var/task/build/dist/src:', fileStructure.buildDistSrcFiles);
        }
      }
      
      // Intentar cargar SimpleAppModule (sin TypeORM) desde carpeta build
      let AppModule;
      const simpleModulePath = '/var/task/build/dist/src/simple-app.module';
      
      console.log(`🔍 Intentando cargar SimpleAppModule desde: ${simpleModulePath}`);
      
      if (fs.existsSync(simpleModulePath + '.js')) {
        console.log(`✅ Archivo ${simpleModulePath}.js existe`);
        AppModule = require(simpleModulePath).SimpleAppModule;
        console.log(`✅ SimpleAppModule cargado exitosamente`);
      } else {
        // Actualizar fileStructure para mostrar build también
        if (fileStructure.rootFiles && fileStructure.rootFiles.includes('build')) {
          fileStructure.buildFiles = fs.readdirSync('/var/task/build');
          if (fileStructure.buildFiles.includes('dist')) {
            fileStructure.buildDistFiles = fs.readdirSync('/var/task/build/dist');
            if (fileStructure.buildDistFiles.includes('src')) {
              fileStructure.buildDistSrcFiles = fs.readdirSync('/var/task/build/dist/src');
            }
          }
        }
        throw new Error(`Archivo ${simpleModulePath}.js no encontrado. Estructura: ${JSON.stringify(fileStructure)}`);
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
    
    // Debugging: listar archivos en el directorio
    const fs = require('fs');
    let fileInfo = {};
    
    try {
      fileInfo.rootFiles = fs.readdirSync('/var/task');
      if (fileInfo.rootFiles.includes('dist')) {
        fileInfo.distFiles = fs.readdirSync('/var/task/dist');
        if (fileInfo.distFiles.includes('src')) {
          fileInfo.distSrcFiles = fs.readdirSync('/var/task/dist/src');
        }
      }
    } catch (e) {
      fileInfo.listError = e.message;
    }
    
    return res.status(500).json({
      error: 'Serverless function failed',
      message: error.message,
      debug: {
        __dirname,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV,
        hasDB: !!process.env.DB_HOST
      },
      fileStructure: fileInfo
    });
  }
};