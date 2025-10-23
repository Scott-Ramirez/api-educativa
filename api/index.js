const { NestFactory } = require('@nestjs/core');

let app;

async function createNestApp() {
  if (!app) {
    try {
      // Intentar múltiples rutas para AppModule basado en el directorio de trabajo
      let AppModule;
      const fs = require('fs');
      const path = require('path');
      
      // Primero, exploremos la estructura de directorios
      console.log('📁 Directorio actual:', process.cwd());
      console.log('📁 __dirname:', __dirname);
      
      const paths = [
        '../dist/src/app.module',
        '../dist/app.module', 
        '/var/task/dist/src/app.module',
        './dist/src/app.module',
        'dist/src/app.module',
        path.join(process.cwd(), 'dist', 'src', 'app.module'),
        path.join(__dirname, '..', 'dist', 'src', 'app.module')
      ];
      
      let lastError;
      for (const modulePath of paths) {
        try {
          console.log(`🔍 Intentando cargar desde: ${modulePath}`);
          
          // Verificar si el archivo existe
          if (fs.existsSync(modulePath + '.js')) {
            console.log(`✅ Archivo encontrado: ${modulePath}.js`);
          } else {
            console.log(`❌ Archivo NO encontrado: ${modulePath}.js`);
          }
          
          AppModule = require(modulePath).AppModule;
          console.log(`✅ AppModule cargado exitosamente desde: ${modulePath}`);
          break;
        } catch (error) {
          console.log(`❌ Falló ${modulePath}: ${error.message}`);
          lastError = error;
        }
      }
      
      if (!AppModule) {
        // Listar contenido del directorio para debugging
        try {
          const rootFiles = fs.readdirSync('/var/task');
          console.log('📂 Contenido de /var/task:', rootFiles);
          
          if (rootFiles.includes('dist')) {
            const distFiles = fs.readdirSync('/var/task/dist');
            console.log('📂 Contenido de /var/task/dist:', distFiles);
            
            if (distFiles.includes('src')) {
              const srcFiles = fs.readdirSync('/var/task/dist/src');
              console.log('📂 Contenido de /var/task/dist/src:', srcFiles);
            }
          }
        } catch (e) {
          console.log('Error listando directorios:', e.message);
        }
        
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