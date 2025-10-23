import { Response } from 'express';
export declare class FileResponseService {
    private readonly logger;
    serveImageFile(filename: string, response: Response): Promise<void>;
    getFileTestInfo(filename: string): {
        message: string;
        filename: string;
        filePath: string;
        exists: boolean;
        size: number | null;
        staticUrl: string;
    };
    listStudentImages(): {
        message: string;
        directory: string;
        images: string[];
        count: number;
    };
    private getImageFilePath;
    private getStudentsDirectory;
    private fileExists;
    private getContentType;
    private setImageHeaders;
    private isImageFile;
    listImages(): Promise<{
        message: string;
        directory: string;
        images: string[];
        count: number;
        error?: undefined;
    } | {
        message: string;
        error: any;
        directory?: undefined;
        images?: undefined;
        count?: undefined;
    }>;
    testImageAccess(filename: string): Promise<{
        message: string;
        filename: string;
        filePath: string;
        exists: boolean;
        size: number | null;
        staticUrl: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
        filename?: undefined;
        filePath?: undefined;
        exists?: undefined;
        size?: undefined;
        staticUrl?: undefined;
    }>;
}
