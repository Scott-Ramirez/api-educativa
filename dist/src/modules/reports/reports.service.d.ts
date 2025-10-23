import { Repository } from 'typeorm';
import { Activity } from '../activities/entities/activity.entity';
import { Behavior } from '../behaviors/entities/behavior.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';
export declare class ReportsService {
    private readonly activityRepo;
    private readonly behaviorRepo;
    private readonly studentRepo;
    private readonly subjectRepo;
    constructor(activityRepo: Repository<Activity>, behaviorRepo: Repository<Behavior>, studentRepo: Repository<Student>, subjectRepo: Repository<Subject>);
    getDailyReport(fecha: string): Promise<{
        message: string;
        data: {
            fecha: string;
            total_activities: number;
            total_behaviors: number;
            activities: Activity[];
            behaviors: Behavior[];
        };
    }>;
    getWeeklyReport(week: string): Promise<{
        message: string;
        data: {
            message: string;
            data: {
                range: {
                    start: string;
                    end: string;
                };
                total_students: number;
                summary: {};
            };
        };
    }>;
    getMonthlyReport(month: string): Promise<{
        message: string;
        data: {
            message: string;
            data: {
                range: {
                    start: string;
                    end: string;
                };
                total_students: number;
                summary: {};
            };
        };
    }>;
    getRangeReport(start: string, end: string): Promise<{
        message: string;
        data: {
            range: {
                start: string;
                end: string;
            };
            total_students: number;
            summary: {};
        };
    }>;
    private groupDataByStudent;
    private getDateOfISOWeek;
}
