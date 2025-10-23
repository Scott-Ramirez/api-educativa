import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(dto: CreateActivityDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/activity.entity").Activity[]>;
    getActivitiesByStudent(studentId: string): Promise<import("./entities/activity.entity").Activity[]>;
    findOne(id: string): Promise<import("./entities/activity.entity").Activity>;
    update(id: string, dto: UpdateActivityDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
