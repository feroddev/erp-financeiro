import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'phone must contain only numbers',
  })
  @MinLength(10)
  @MaxLength(11)
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'document must contain only numbers',
  })
  @MinLength(11)
  @MaxLength(14)
  document?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;
}
