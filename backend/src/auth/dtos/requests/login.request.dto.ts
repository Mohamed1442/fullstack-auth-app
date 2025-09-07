import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'User email',
  })
  @Transform(({ value }) => String(value).trim())
  @IsEmail()
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
