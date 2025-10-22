import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Tarea de Álgebra' })
  titulo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Resolver ejercicios 1-20', required: false })
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2025-10-17' })
  fecha: string; // formato YYYY-MM-DD

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 8, required: false })
  nota?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  subjectId: number;
}
