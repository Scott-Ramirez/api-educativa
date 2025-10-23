import { Module } from '@nestjs/common';
import { BasicHealthController } from './basic-health.controller';

@Module({
  controllers: [BasicHealthController],
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        message: 'API Educativa funcionando correctamente',
        timestamp: new Date().toISOString(),
        progressive: true,
        hasConfig: true,
        hasController: true
      }
    }
  ],
})
export class ProgressiveAppModule {}