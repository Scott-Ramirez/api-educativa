"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const core_2 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const roles_guard_1 = require("./modules/auth/roles.guard");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const health_controller_1 = require("./health.controller");
const students_module_1 = require("./modules/students/students.module");
const subjects_module_1 = require("./modules/subjects/subjects.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const activities_module_1 = require("./modules/activities/activities.module");
const behaviors_module_1 = require("./modules/behaviors/behaviors.module");
const grades_module_1 = require("./modules/grades/grades.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const reports_module_1 = require("./modules/reports/reports.module");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const invites_module_1 = require("./modules/invites/invites.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT ?? '3306', 10),
                username: process.env.DB_USER || 'root',
                password: process.env.DB_PASS || '',
                database: process.env.DB_NAME || 'educativa_db',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                synchronize: false,
                migrationsRun: true,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                connectTimeout: 60000,
                acquireTimeout: 60000,
                timezone: 'Z',
                logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
            }),
            students_module_1.StudentsModule,
            subjects_module_1.SubjectsModule,
            schedules_module_1.SchedulesModule,
            activities_module_1.ActivitiesModule,
            behaviors_module_1.BehaviorsModule,
            grades_module_1.GradesModule,
            attendance_module_1.AttendanceModule,
            reports_module_1.ReportsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            invites_module_1.InvitesModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            core_1.Reflector,
            {
                provide: core_2.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_2.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_2.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map