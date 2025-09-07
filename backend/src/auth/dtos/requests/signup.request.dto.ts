import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({
    example: 'Mohamed',
    description: 'User name',
  })
  @IsString()
  @Transform(({ value }) => String(value).trim())
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'User email',
  })
  @Transform(({ value }) => String(value).trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Test@123',
  })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
  })
  password: string;
}
