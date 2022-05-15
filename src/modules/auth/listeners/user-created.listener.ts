import { Environment } from '@interfaces';
import { UserCreatedEvent } from '@modules/users/events';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../auth.service';

@Injectable()
export class UserCreatedListener {
  private clientAppUrl: string;

  constructor(
    private readonly _auth: AuthService,
    private readonly _mailer: MailerService,
    private _config: ConfigService<Environment>,
  ) {
    this.clientAppUrl = this._config.get<string>('clientAppUrl');
  }

  @OnEvent('user.created')
  handleOrderCreatedEvent(event: UserCreatedEvent) {
    const { user } = event;
    const token = this._auth.createToken(user);
    const confirmLink = `${this.clientAppUrl}/auth/confirm/account?token=${token}`;

    this._mailer.sendMail({
      to: user.email, // list of receivers
      subject: 'Verificar correo electrónico', // Subject line
      template: 'auth_verify-email',
      context: {
        confirmLink,
        firstName: user.firstName,
      },
    });
  }
}
