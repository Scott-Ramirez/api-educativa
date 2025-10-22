import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  getDailyReport(@Query('date') date: string) {
    return this.reportsService.getDailyReport(date);
  }

  @Get('weekly')
  getWeeklyReport(@Query('week') week: string) {
    return this.reportsService.getWeeklyReport(week);
  }

  @Get('monthly')
  getMonthlyReport(@Query('month') month: string) {
    return this.reportsService.getMonthlyReport(month);
  }

  @Get('range')
  getRangeReport(@Query('start') start: string, @Query('end') end: string) {
    return this.reportsService.getRangeReport(start, end);
  }
}
