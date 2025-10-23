import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<any[]>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateUserDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
