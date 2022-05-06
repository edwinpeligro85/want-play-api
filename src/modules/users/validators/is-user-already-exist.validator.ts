import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private _user: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this._user.findOneByEmail(email);

    return user === undefined || user === null;
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}
