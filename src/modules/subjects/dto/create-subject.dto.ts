import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Matemáticas' })
  nombre: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Algebra, geometría', required: false })
  descripcion?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '#FF0000', required: false })
  color?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'calculator', required: false })
  icono?: string;
}
