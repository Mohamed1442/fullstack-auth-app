import { ApiResponseProperty } from '@nestjs/swagger';
import { ITokens } from 'src/auth/interfaces';
import { ERole } from 'src/users/enum';
import { UserDocument } from 'src/users/schemas';

export class UserResponseDto {
  @ApiResponseProperty({ example: '64b7f0c2f1d2c8a1b2c3d4e5' })
  id: string;

  @ApiResponseProperty({ example: 'user@example.com' })
  email: string;

  @ApiResponseProperty({ example: 'Mohamed' })
  name: string;

  @ApiResponseProperty({ enum: ERole })
  role: ERole;

  constructor(user: UserDocument) {
    this.id = user._id.toString();
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
  }
}
