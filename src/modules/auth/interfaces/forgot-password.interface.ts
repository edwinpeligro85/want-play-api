import { User } from '@modules/users/schemas';

export interface ForgotPassword {
  user: User;
  ip: string;
}
