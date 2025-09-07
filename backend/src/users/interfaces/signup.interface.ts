import { ERole } from '../enum';

export interface ISignup {
  name: string;
  email: string;
  password: string;
  role: ERole;
}
