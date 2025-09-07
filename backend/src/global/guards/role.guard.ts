import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ERole } from 'src/users/enum';
import { forbiddenProperties } from '../constants';

export class RoleGuard implements CanActivate {
  constructor(private readonly acceptedRoles: ERole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const { currentUser } = context.switchToHttp().getRequest();

    if (!this.acceptedRoles.includes(currentUser?.role)) {
      throw new ForbiddenException(forbiddenProperties);
    }

    return true;
  }
}
