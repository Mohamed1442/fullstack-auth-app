import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard, RoleGuard } from '../guards';
import { ERole } from 'src/users/enum';
import { ApiSingleUnauthorized } from './api-unauthorized-response.decorator';
import { ApiSingleForbidden } from './api-forbidden-response.decorator';

export function AuthRoles(...roles: ERole[]) {
  return applyDecorators(
    UseGuards(AccessTokenGuard, new RoleGuard(roles)),
    ApiBearerAuth(),
    ApiSingleUnauthorized(),
    ApiSingleForbidden(),
  );
}
