import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email ou nome de usuário' })
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty({ example: 'password123', description: 'Senha' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
