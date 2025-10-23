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
      
      // Verificar dependencias críticas e intentar require dinámico
      console.log('🔍 Verificando dependencias críticas...');
      
      try {
        require('@nestjs/config');
        console.log('✅ @nestjs/config está disponible');
      } catch (configError) {
        console.log('❌ @nestjs/config no disponible:', configError.message);
      }
      
      try {
        require('@nestjs/typeorm');
        console.log('✅ @nestjs/typeorm está disponible');
      } catch (typeormError) {
        console.log('❌ @nestjs/typeorm no disponible:', typeormError.message);
      }
      
      // Intentar cargar AppModule original desde carpeta build
      let AppModule;
      const appModulePath = '/var/task/build/dist/src/app.module';
      
      console.log(`🔍 Intentando cargar AppModule desde: ${appModulePath}`);
      
      if (fs.existsSync(appModulePath + '.js')) {
        console.log(`✅ Archivo ${appModulePath}.js existe`);
        try {
          AppModule = require(appModulePath).AppModule;
          console.log(`✅ AppModule cargado exitosamente`);
        } catch (appModuleError) {
          console.log(`❌ Error cargando AppModule:`, appModuleError.message);
          
          // Si falla por dependencias, intentar instalarlas dinámicamente
          if (appModuleError.message.includes('@nestjs/config')) {
            console.log('🔧 Intentando cargar @nestjs/config desde node_modules...');
            
            // Intentar diferentes rutas para @nestjs/config
            const possiblePaths = [
              '/var/task/node_modules/@nestjs/config',
              './node_modules/@nestjs/config',
              '../node_modules/@nestjs/config'
            ];
            
            for (const path of possiblePaths) {
              if (fs.existsSync(path)) {
                console.log(`✅ Encontrado @nestjs/config en: ${path}`);
                break;
              } else {
                console.log(`❌ No encontrado en: ${path}`);
              }
            }
          }
          
          return res.status(500).json({
            error: 'Error loading AppModule',
            message: appModuleError.message,
            debug: {
              __dirname,
              cwd: process.cwd(),
              nodeEnv: process.env.NODE_ENV,
              hasDB: !!process.env.DB_HOST,
              nodeModulesExists: fs.existsSync('/var/task/node_modules'),
              nestjsConfigExists: fs.existsSync('/var/task/node_modules/@nestjs/config'),
              nestjsTypeormExists: fs.existsSync('/var/task/node_modules/@nestjs/typeorm')
            },
            fileStructure
          });
        }
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
        throw new Error(`Archivo ${ultraSimpleModulePath}.js no encontrado. Estructura: ${JSON.stringify(fileStructure)}`);
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