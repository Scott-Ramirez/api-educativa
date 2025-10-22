import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get('student/:studentId')
  @Roles('PARENT', 'ADMIN')
  getActivitiesByStudent(@Param('studentId') studentId: string) {
    return this.activitiesService.findByStudent(+studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
