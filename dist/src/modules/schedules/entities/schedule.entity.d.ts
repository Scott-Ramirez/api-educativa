import { Subject } from '../../subjects/entities/subject.entity';
export declare class Schedule {
    id: number;
    dia: string;
    hora_inicio: string;
    hora_fin: string;
    subject: Subject;
    created_at: Date;
}
