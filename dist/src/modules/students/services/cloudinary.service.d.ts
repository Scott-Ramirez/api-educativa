import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadImage(buffer: Buffer, filename: string, studentId: number): Promise<{
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
    }>;
    deleteImage(publicId: string): Promise<boolean>;
    getImageInfo(publicId: string): Promise<any>;
    listStudentImages(): Promise<any[]>;
    generateTransformedUrl(publicId: string, options?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
    }): string;
}
