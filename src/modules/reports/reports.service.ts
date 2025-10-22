import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Activity } from '../activities/entities/activity.entity';
import { Behavior } from '../behaviors/entities/behavior.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,

    @InjectRepository(Behavior)
    private readonly behaviorRepo: Repository<Behavior>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  // 📅 Reporte diario
  async getDailyReport(fecha: string) {
    const activities = await this.activityRepo.find({
      where: { fecha },
      relations: ['student', 'subject'],
    });

    const behaviors = await this.behaviorRepo.find({
      where: { fecha },
      relations: ['student'],
    });

    return {
      message: `Reporte diario para ${fecha}`,
      data: {
        fecha,
        total_activities: activities.length,
        total_behaviors: behaviors.length,
        activities,
        behaviors,
      },
    };
  }

  // 📆 Reporte semanal
  async getWeeklyReport(week: string) {
    const [year, weekNumber] = week.split('-W').map(Number);
    const start = this.getDateOfISOWeek(weekNumber, year);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      message: `Reporte semanal ${week}`,
      data: await this.getRangeReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0]),
    };
  }

  // 🗓️ Reporte mensual
  async getMonthlyReport(month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0);
    return {
      message: `Reporte mensual ${month}`,
      data: await this.getRangeReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0]),
    };
  }

  // ⏱️ Reporte por rango de fechas
  async getRangeReport(start: string, end: string) {
    const activities = await this.activityRepo.find({
      where: { fecha: Between(start, end) },
      relations: ['student', 'subject'],
    });

    const behaviors = await this.behaviorRepo.find({
      where: { fecha: Between(start, end) },
      relations: ['student'],
    });

    const grouped = this.groupDataByStudent(activities, behaviors);

    return {
      message: `Reporte de rango ${start} a ${end}`,
      data: {
        range: { start, end },
        total_students: Object.keys(grouped).length,
        summary: grouped,
      },
    };
  }

  // 🔹 Agrupar datos por estudiante
  private groupDataByStudent(activities: Activity[], behaviors: Behavior[]) {
    const result = {};

    for (const act of activities) {
      const id = act.student.id;
      if (!result[id]) {
        result[id] = {
          student: act.student,
          activities: [],
          behaviors: [],
          average_grade: 0,
        };
      }
      result[id].activities.push(act);
    }

    for (const beh of behaviors) {
      const id = beh.student.id;
      if (!result[id]) {
        result[id] = {
          student: beh.student,
          activities: [],
          behaviors: [],
          average_grade: 0,
        };
      }
      result[id].behaviors.push(beh);
    }

    for (const key in result) {
      const studentData = result[key];
      const grades = studentData.activities.map(a => a.grade);
      studentData.average_grade =
        grades.length > 0
          ? grades.reduce((a, b) => a + b, 0) / grades.length
          : 0;
    }

    return result;
  }

  // 🧮 Obtener fecha de inicio de una semana ISO (para reportes semanales)
  private getDateOfISOWeek(week: number, year: number) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  }
}
