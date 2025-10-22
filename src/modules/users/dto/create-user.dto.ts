import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Juan Perez' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ example: 'changeme123' })
  password: string;

  @ApiProperty({ example: 'USER', required: false })
  role?: string;
}
