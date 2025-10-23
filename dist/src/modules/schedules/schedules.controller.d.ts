import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    create(dto: CreateScheduleDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/schedule.entity").Schedule[]>;
    findOne(id: string): Promise<import("./entities/schedule.entity").Schedule>;
    update(id: string, dto: UpdateScheduleDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
