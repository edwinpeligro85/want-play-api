import { User } from '@modules/users/esquemas';

export interface ForgotPassword {
  user: User;
  ip: string;
}
