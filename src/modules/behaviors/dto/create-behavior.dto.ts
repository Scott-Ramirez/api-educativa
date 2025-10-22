import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBehaviorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2025-10-17' })
  fecha: string; // formato YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Excelente' })
  estado: string; // Ej: Excelente, Bueno, Regular, Malo

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Mostró excelente conducta', required: false })
  observaciones?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  studentId: number;
}
