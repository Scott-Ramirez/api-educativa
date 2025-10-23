import { Repository } from 'typeorm';
import { Behavior } from './entities/behavior.entity';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';
import { Student } from '../students/entities/student.entity';
export declare class BehaviorsService {
    private behaviorRepo;
    private studentRepo;
    constructor(behaviorRepo: Repository<Behavior>, studentRepo: Repository<Student>);
    create(dto: CreateBehaviorDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Behavior[]>;
    findByStudent(studentId: number): Promise<Behavior[]>;
    findOne(id: number): Promise<Behavior>;
    update(id: number, dto: UpdateBehaviorDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
