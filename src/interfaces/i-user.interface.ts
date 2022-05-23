import { Status } from '@modules/users/enums';

export interface IUser {
  _id?: string;
  email: string;
  status: Status;
  password?: string;
  lastName?: string;
  firstName: string;
  facebookId?: string;
}
