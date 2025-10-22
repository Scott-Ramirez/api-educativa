import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  fecha: string; // formato YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  estado: string; // 'PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'

  @IsString()
  @IsOptional()
  hora_llegada?: string; // formato HH:mm

  @IsString()
  @IsOptional()
  justificacion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsNumber()
  studentId: number;
}