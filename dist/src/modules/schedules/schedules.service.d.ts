import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Subject } from '../subjects/entities/subject.entity';
export declare class SchedulesService {
    private scheduleRepository;
    private subjectRepository;
    constructor(scheduleRepository: Repository<Schedule>, subjectRepository: Repository<Subject>);
    create(dto: CreateScheduleDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Schedule[]>;
    findOne(id: number): Promise<Schedule>;
    update(id: number, dto: UpdateScheduleDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
