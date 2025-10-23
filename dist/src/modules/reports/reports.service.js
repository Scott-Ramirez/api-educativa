"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("../activities/entities/activity.entity");
const behavior_entity_1 = require("../behaviors/entities/behavior.entity");
const student_entity_1 = require("../students/entities/student.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let ReportsService = class ReportsService {
    activityRepo;
    behaviorRepo;
    studentRepo;
    subjectRepo;
    constructor(activityRepo, behaviorRepo, studentRepo, subjectRepo) {
        this.activityRepo = activityRepo;
        this.behaviorRepo = behaviorRepo;
        this.studentRepo = studentRepo;
        this.subjectRepo = subjectRepo;
    }
    async getDailyReport(fecha) {
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
    async getWeeklyReport(week) {
        const [year, weekNumber] = week.split('-W').map(Number);
        const start = this.getDateOfISOWeek(weekNumber, year);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return {
            message: `Reporte semanal ${week}`,
            data: await this.getRangeReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0]),
        };
    }
    async getMonthlyReport(month) {
        const [year, monthNum] = month.split('-').map(Number);
        const start = new Date(year, monthNum - 1, 1);
        const end = new Date(year, monthNum, 0);
        return {
            message: `Reporte mensual ${month}`,
            data: await this.getRangeReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0]),
        };
    }
    async getRangeReport(start, end) {
        const activities = await this.activityRepo.find({
            where: { fecha: (0, typeorm_2.Between)(start, end) },
            relations: ['student', 'subject'],
        });
        const behaviors = await this.behaviorRepo.find({
            where: { fecha: (0, typeorm_2.Between)(start, end) },
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
    groupDataByStudent(activities, behaviors) {
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
    getDateOfISOWeek(week, year) {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dow = simple.getDay();
        const ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        return ISOweekStart;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(1, (0, typeorm_1.InjectRepository)(behavior_entity_1.Behavior)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map