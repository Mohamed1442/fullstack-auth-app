import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { unauthorizedProperties } from '../constants';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  override getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions {
    const options = super.getAuthenticateOptions(context) || {};

    options.property = 'currentUser';

    return options;
  }

  override handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(unauthorizedProperties);
    }
    return user;
  }
}
