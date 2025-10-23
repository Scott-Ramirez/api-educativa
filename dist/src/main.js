"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }
    });
    const globalPrefix = 'api/v1';
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('API Educativa')
            .setDescription('Documentación de la API del sistema educativo')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api-docs', app, document);
    }
    const configService = app.get(config_1.ConfigService);
    const port = Number(process.env.PORT || configService.get('PORT') || 3000);
    await app.listen(port, '0.0.0.0');
    common_1.Logger.log(`🚀 Servidor en: http://localhost:${port}/${globalPrefix}`);
    common_1.Logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
        common_1.Logger.log(`📘 Swagger: http://localhost:${port}/api-docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map