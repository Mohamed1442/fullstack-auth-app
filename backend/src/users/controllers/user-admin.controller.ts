import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, AuthRoles } from 'src/global/decorators';
import { ERole } from '../enum';
import { UsersService } from '../services';
import { ResponseBuilder } from 'src/global/utilities';
import { UserResponseDto } from '../dtos/responses';
import { PageOptionsDto } from 'src/global/dtos';
import { TransactionInterceptor } from 'src/global/interceptors';

@ApiTags('Users - Admin')
@Controller('admin/users')
@UseInterceptors(TransactionInterceptor)
@AuthRoles(ERole.ADMIN)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (for the admin usage only)' })
  @ApiPaginatedResponse(UserResponseDto)
  async findAllUsers(@Query() pageOptionsDto: PageOptionsDto) {
    const [users, count] = await Promise.all([
      this.usersService.findAllUsers(pageOptionsDto),
      this.usersService.findAllUsersCount(),
    ]);

    return ResponseBuilder.buildMultipleWithPaginated(
      users.map((user) => new UserResponseDto(user)),
      count,
      pageOptionsDto,
    );
  }
}
