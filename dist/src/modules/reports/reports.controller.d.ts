import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailyReport(date: string): Promise<{
        message: string;
        data: {
            fecha: string;
            total_activities: number;
            total_behaviors: number;
            activities: import("../activities/entities/activity.entity").Activity[];
            behaviors: import("../behaviors/entities/behavior.entity").Behavior[];
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
}
