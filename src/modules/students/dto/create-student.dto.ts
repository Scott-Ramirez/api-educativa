import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'María López' })
  nombre: string;

  @IsInt()
  @Min(5)
  @Max(18)
  @ApiProperty({ example: 12 })
  edad: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '6° Grado' })
  grado: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Primario', required: false })
  nivel?: string;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/foto.jpg', required: false })
  foto_url?: string;

  @IsOptional()
  @ApiProperty({ example: 'Alérgica a las nueces', required: false })
  observaciones?: string;
}
