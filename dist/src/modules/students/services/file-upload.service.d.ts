import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CloudinaryService } from './cloudinary.service';
export declare class FileUploadService {
    private readonly cloudinaryService;
    private readonly logger;
    constructor(cloudinaryService: CloudinaryService);
    getImageUploadOptions(): MulterOptions;
    private getUploadDestination;
    private generateUniqueFilename;
    private validateImageFile;
    fileExists(filePath: string): boolean;
    uploadStudentImage(studentId: number, file: Express.Multer.File, studentsService: any): Promise<{
        message: string;
        imageUrl: string;
        publicId: string;
        width: number;
        height: number;
        format: string;
        size: number;
    }>;
    deleteStudentImage(studentId: number, publicId: string, studentsService: any): Promise<boolean>;
    deleteFile(filePath: string): boolean;
    listFiles(directory: string): string[];
    private isProduction;
    private getMaxFileSize;
    private ensureDirectoryExists;
    private isImageFile;
}
