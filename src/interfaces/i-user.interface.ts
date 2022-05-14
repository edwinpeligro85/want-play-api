import { Gender, Status } from '@modules/users/enums';

export interface IUser {
  _id?: string;
  age?: number;
  email: string;
  status: Status;
  gender?: Gender;
  password?: string;
  lastName?: string;
  firstName: string;
}
