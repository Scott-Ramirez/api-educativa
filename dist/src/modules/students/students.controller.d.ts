import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileUploadService } from './services/file-upload.service';
import { FileResponseService } from './services/file-response.service';
export declare class StudentsController {
    private readonly studentsService;
    private readonly fileUploadService;
    private readonly fileResponseService;
    constructor(studentsService: StudentsService, fileUploadService: FileUploadService, fileResponseService: FileResponseService);
    create(dto: CreateStudentDto): Promise<import("./entities/student.entity").Student>;
    findAll(): Promise<import("./entities/student.entity").Student[]>;
    getMyChildren(req: any): Promise<import("./entities/student.entity").Student[]>;
    findOne(id: string): Promise<import("./entities/student.entity").Student>;
    getStudentRelations(id: string): Promise<{
        invites: any;
        activities: any;
        behaviors: any;
    }>;
    update(id: string, dto: UpdateStudentDto): Promise<import("./entities/student.entity").Student>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    uploadStudentImage(id: string, file: Express.Multer.File): Promise<{
        message: string;
        imageUrl: string;
        publicId: string;
        width: number;
        height: number;
        format: string;
        size: number;
    }>;
    deleteStudentImage(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
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
    serveImage(filename: string, res: any): Promise<void>;
}
