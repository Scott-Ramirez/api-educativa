import { BehaviorsService } from './behaviors.service';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';
export declare class BehaviorsController {
    private readonly behaviorsService;
    constructor(behaviorsService: BehaviorsService);
    create(dto: CreateBehaviorDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/behavior.entity").Behavior[]>;
    getBehaviorsByStudent(studentId: string): Promise<import("./entities/behavior.entity").Behavior[]>;
    findOne(id: string): Promise<import("./entities/behavior.entity").Behavior>;
    update(id: string, dto: UpdateBehaviorDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
