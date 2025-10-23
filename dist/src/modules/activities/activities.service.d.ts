import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';
export declare class ActivitiesService {
    private activityRepo;
    private studentRepo;
    private subjectRepo;
    constructor(activityRepo: Repository<Activity>, studentRepo: Repository<Student>, subjectRepo: Repository<Subject>);
    create(dto: CreateActivityDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Activity[]>;
    findByStudent(studentId: number): Promise<Activity[]>;
    findOne(id: number): Promise<Activity>;
    update(id: number, dto: UpdateActivityDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
