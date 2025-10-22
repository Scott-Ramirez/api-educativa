import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';

@ApiTags('behaviors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('behaviors')
export class BehaviorsController {
  constructor(private readonly behaviorsService: BehaviorsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateBehaviorDto) {
    return this.behaviorsService.create(dto);
  }

  @Get()
  findAll() {
    return this.behaviorsService.findAll();
  }

  @Get('student/:studentId')
  @Roles('PARENT', 'ADMIN')
  getBehaviorsByStudent(@Param('studentId') studentId: string) {
    return this.behaviorsService.findByStudent(+studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.behaviorsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateBehaviorDto) {
    return this.behaviorsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.behaviorsService.remove(+id);
  }
}
