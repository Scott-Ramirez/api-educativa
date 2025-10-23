import { Module } from '@nestjs/common';
import { BasicHealthController } from './basic-health.controller';

// Importar módulos que NO requieren @nestjs/config o @nestjs/typeorm
import { StudentsModule } from './modules/students/students.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { BehaviorsModule } from './modules/behaviors/behaviors.module';
import { GradesModule } from './modules/grades/grades.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    // Módulos funcionales sin TypeORM ni ConfigModule
    StudentsModule,
    ActivitiesModule,
    AttendanceModule,
    BehaviorsModule,
    GradesModule,
    SchedulesModule,
    SubjectsModule,
    UsersModule,
    ReportsModule,
  ],
  controllers: [BasicHealthController],
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
export class FullAppModule {}