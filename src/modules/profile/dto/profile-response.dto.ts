import { Profile } from '../schemas';

export class ProfileResponseDto extends Profile {
  posts: number;
  following: number;
  followers: number;
}
