import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateGradeDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  calificacion: number;

  @IsString()
  @IsNotEmpty()
  tipo: string; // 'EXAMEN', 'TAREA', 'PROYECTO', 'PARTICIPACION'

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  fecha: string; // formato YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  periodo: string; // 'PRIMER_PARCIAL', 'SEGUNDO_PARCIAL', 'TERCER_PARCIAL'

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  valor_maximo?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsNumber()
  studentId: number;

  @IsNumber()
  subjectId: number;
}