import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
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
  getHealthCheck() {
    return {
      status: 'OK',
      database: 'Checking...',
      cloudinary: 'Checking...',
      timestamp: new Date().toISOString()
    };
  }
}