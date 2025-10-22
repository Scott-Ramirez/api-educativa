import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('grades')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.gradesService.findAll();
  }

  @Get('student/:studentId')
  @Roles('PARENT', 'ADMIN')
  getGradesByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(+studentId);
  }

  @Get('student/:studentId/statistics')
  @Roles('PARENT', 'ADMIN')
  getGradesStatistics(@Param('studentId') studentId: string) {
    return this.gradesService.getGradesStatistics(+studentId);
  }

  @Get('student/:studentId/subject/:subjectId')
  @Roles('PARENT', 'ADMIN')
  getGradesByStudentAndSubject(
    @Param('studentId') studentId: string,
    @Param('subjectId') subjectId: string
  ) {
    return this.gradesService.findByStudentAndSubject(+studentId, +subjectId);
  }

  @Get('student/:studentId/period/:periodo')
  @Roles('PARENT', 'ADMIN')
  getGradesByPeriod(
    @Param('studentId') studentId: string,
    @Param('periodo') periodo: string
  ) {
    return this.gradesService.getGradesByPeriod(+studentId, periodo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(+id, updateGradeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }
}