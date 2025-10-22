import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lunes' })
  dia: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '08:00' })
  hora_inicio: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09:30' })
  hora_fin: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  subjectId: number;
}
