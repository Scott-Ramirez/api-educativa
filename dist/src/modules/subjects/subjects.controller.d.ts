import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(dto: CreateSubjectDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/subject.entity").Subject[]>;
    findOne(id: string): Promise<import("./entities/subject.entity").Subject>;
    update(id: string, dto: UpdateSubjectDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
