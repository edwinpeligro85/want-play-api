import { Profile } from '@modules/profile/schemas';
import { Status } from '@modules/users/enums';

export interface IUser {
  _id?: string;
  profile?: string | Profile;
  email: string;
  status: Status;
  password?: string;
  lastName?: string;
  firstName: string;
  facebookId?: string;
}
