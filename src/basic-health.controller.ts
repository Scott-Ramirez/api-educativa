import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class BasicHealthController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      message: 'API Educativa - Health Check',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      hasController: true
    };
  }

  @Get('detail')
  getDetailedHealth() {
    return {
      status: 'OK',
      message: 'API Educativa - Detailed Health Check',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      hasController: true,
      hasRoutes: true
    };
  }
}