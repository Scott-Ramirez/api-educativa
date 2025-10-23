"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullAppModule = void 0;
const common_1 = require("@nestjs/common");
const basic_health_controller_1 = require("./basic-health.controller");
const students_module_1 = require("./modules/students/students.module");
const activities_module_1 = require("./modules/activities/activities.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const behaviors_module_1 = require("./modules/behaviors/behaviors.module");
const grades_module_1 = require("./modules/grades/grades.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const subjects_module_1 = require("./modules/subjects/subjects.module");
const users_module_1 = require("./modules/users/users.module");
const reports_module_1 = require("./modules/reports/reports.module");
let FullAppModule = class FullAppModule {
};
exports.FullAppModule = FullAppModule;
exports.FullAppModule = FullAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            students_module_1.StudentsModule,
            activities_module_1.ActivitiesModule,
            attendance_module_1.AttendanceModule,
            behaviors_module_1.BehaviorsModule,
            grades_module_1.GradesModule,
            schedules_module_1.SchedulesModule,
            subjects_module_1.SubjectsModule,
            users_module_1.UsersModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [basic_health_controller_1.BasicHealthController],
        providers: [
            {
                provide: 'DATABASE_CONFIG',
                useValue: {
                    host: process.env.DB_HOST || 'sql10.freesqldatabase.com',
                    port: parseInt(process.env.DB_PORT || '3306'),
                    username: process.env.DB_USERNAME || 'sql10804152',
                    password: process.env.DB_PASSWORD || 'X3ltkbjtPI',
                    database: process.env.DB_DATABASE || 'sql10804152',
                }
            },
            {
                provide: 'APP_CONFIG',
                useValue: {
                    message: 'API Educativa - Full Module funcionando',
                    timestamp: new Date().toISOString(),
                    fullModule: true,
                    hasDatabase: true,
                    hasAllModules: true,
                    environment: process.env.NODE_ENV || 'production'
                }
            }
        ],
    })
], FullAppModule);
//# sourceMappingURL=full-app.module.js.map