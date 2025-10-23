import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsService {
    private subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    create(data: CreateSubjectDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Subject[]>;
    findOne(id: number): Promise<Subject>;
    update(id: number, data: UpdateSubjectDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
