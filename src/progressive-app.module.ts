import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        message: 'API Educativa funcionando correctamente',
        timestamp: new Date().toISOString(),
        progressive: true,
        hasConfig: true
      }
    }
  ],
})
export class ProgressiveAppModule {}