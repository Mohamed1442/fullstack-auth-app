import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from '../interfaces';
import { RequestWithUserData } from '../types';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): ICurrentUser => {
    const request: RequestWithUserData = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
