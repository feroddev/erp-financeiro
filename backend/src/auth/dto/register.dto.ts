import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Nome de usuário', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123', description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
