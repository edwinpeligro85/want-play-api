import { UserCreatedEvent } from '@modules/users/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProfileService } from '../profile.service';

@Injectable()
export class UserCreatedListener {
  constructor(private _profile: ProfileService) {}

  @OnEvent('user.created')
  async handleOrderCreatedEvent({ user }: UserCreatedEvent) {
    const profile = await this._profile.create();

    user.profile = profile._id;
    user.save();
  }
}
