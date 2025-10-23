import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class HealthController {
  @Get()
  @Public()
  getHealth() {
    return {
      status: 'OK',
      message: 'API Educativa funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }

  @Get('health')
  @Public()
  getHealthCheck() {
    return {
      status: 'OK',
      database: 'Checking...',
      cloudinary: 'Checking...',
      timestamp: new Date().toISOString()
    };
  }
}