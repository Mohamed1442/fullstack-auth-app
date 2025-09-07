import { ERole } from 'src/users/enum';

export interface ICurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: ERole;
}
