import { User } from '../../users/entities/user.entity';
export declare class Student {
    id: number;
    nombre: string;
    edad: number;
    grado: string;
    nivel: string;
    foto_url: string;
    cloudinary_public_id: string;
    observaciones: string;
    created_at: Date;
    user: User;
}
