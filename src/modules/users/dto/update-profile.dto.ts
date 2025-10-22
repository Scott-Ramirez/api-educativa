import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Nombre del usuario', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email del usuario', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Contraseña actual (requerida para cambiar contraseña)', required: false })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({ description: 'Nueva contraseña', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;
}