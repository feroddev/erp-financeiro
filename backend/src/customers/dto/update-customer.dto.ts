import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message: 'phone must be a valid phone number',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\d.\-\/]+$/, {
    message: 'document must contain only numbers, dots, dashes and slashes',
  })
  @MinLength(11)
  @MaxLength(18)
  document?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;
}
