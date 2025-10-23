export declare class BasicHealthController {
    getHealth(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
        hasController: boolean;
    };
    getDetailedHealth(): {
        status: string;
        message: string;
        timestamp: string;
        environment: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        hasController: boolean;
        hasRoutes: boolean;
    };
}
