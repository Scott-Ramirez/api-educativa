import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// 🔐 Auth & Seguridad
import { RolesGuard } from './modules/auth/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// 📦 Módulos del sistema
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { BehaviorsModule } from './modules/behaviors/behaviors.module';
import { GradesModule } from './modules/grades/grades.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitesModule } from './modules/invites/invites.module';

@Module({
  imports: [
    // 🌱 Variables de entorno globales
    ConfigModule.forRoot({ isGlobal: true }),

    // 🗄️ Conexión a MySQL (desarrollo y producción)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'educativa_db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timezone: 'Z',
    }),

    // 📚 Módulos principales
    StudentsModule,
    SubjectsModule,
    SchedulesModule,
    ActivitiesModule,
    BehaviorsModule,
    GradesModule,
    AttendanceModule,
    ReportsModule,
    UsersModule,
    AuthModule,
    InvitesModule,
  ],
  providers: [
    Reflector,
    // 🛡️ Guard global de roles
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // 🎯 Interceptor global de respuestas
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
