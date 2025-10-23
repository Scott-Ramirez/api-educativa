export declare class HealthController {
    getHealth(): {
        status: string;
        message: string;
        timestamp: string;
        environment: string;
        version: string;
    };
    getHealthCheck(): {
        status: string;
        database: string;
        cloudinary: string;
        timestamp: string;
    };
}
