import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiSingleDataResponse,
  AuthRoles,
  CurrentUser,
} from 'src/global/decorators';
import { ERole } from '../enum';
import { UsersService } from '../services';
import type { ICurrentUser } from 'src/global/interfaces';
import { ResponseBuilder } from 'src/global/utilities';
import { UserResponseDto } from '../dtos/responses';
import { UserDocument } from '../schemas';
import { TransactionInterceptor } from 'src/global/interceptors';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(TransactionInterceptor)
@AuthRoles(ERole.USER, ERole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/info')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiSingleDataResponse(UserResponseDto)
  async findCurrentUserInfo(@CurrentUser() currentUser: ICurrentUser) {
    const user = await this.usersService.findUserById(currentUser.id);

    return ResponseBuilder.buildSingle(
      new UserResponseDto(user as UserDocument),
    );
  }
}
