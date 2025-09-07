import { Request } from 'express';
import { ICurrentUser } from '../interfaces';

export type RequestWithUserData = Request & {
  currentUser: ICurrentUser;
};
