import { UserDocument } from '../esquemas';

export class UserCreatedEvent {
  user: UserDocument;
}
