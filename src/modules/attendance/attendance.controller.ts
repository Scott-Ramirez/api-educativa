import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('student/:studentId')
  @Roles('PARENT', 'ADMIN')
  getAttendanceByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(+studentId);
  }

  @Get('student/:studentId/statistics')
  @Roles('PARENT', 'ADMIN')
  getAttendanceStatistics(@Param('studentId') studentId: string) {
    return this.attendanceService.getAttendanceStatistics(+studentId);
  }

  @Get('student/:studentId/range')
  @Roles('PARENT', 'ADMIN')
  getAttendanceByDateRange(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.attendanceService.findByStudentAndDateRange(+studentId, startDate, endDate);
  }

  @Get('student/:studentId/month/:year/:month')
  @Roles('PARENT', 'ADMIN')
  getAttendanceByMonth(
    @Param('studentId') studentId: string,
    @Param('year') year: string,
    @Param('month') month: string
  ) {
    return this.attendanceService.getAttendanceByMonth(+studentId, +year, +month);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}