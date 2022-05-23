import { UserDocument } from '../schemas';

export class UserCreatedEvent {
  user: UserDocument;
}
