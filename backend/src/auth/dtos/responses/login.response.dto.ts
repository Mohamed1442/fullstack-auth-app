import { ApiResponseProperty } from '@nestjs/swagger';
import { ITokens } from 'src/auth/interfaces';

export class LoginResponseDto {
  @ApiResponseProperty({ example: 'some-access-token' })
  accessToken: string;

  @ApiResponseProperty({ example: 'some-refresh-token' })
  refreshToken: string;

  @ApiResponseProperty({ example: 'APPROVED' })
  status: string;

  constructor(data: ITokens) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
