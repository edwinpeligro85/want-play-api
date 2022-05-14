import { Config } from '@config';
import { UserDocument } from '@modules/users/esquemas';
import { UserCreatedEvent } from '@modules/users/events';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../auth.service';

@Injectable()
export class ForgotPasswordListener {
  private clientAppUrl: string;

  constructor(
    private readonly _auth: AuthService,
    private readonly _mailer: MailerService,
    private _config: ConfigService,
  ) {
    this.clientAppUrl = this._config.get<string>(Config.CLIENT_APP_URL);
  }

  @OnEvent('forgot-password')
  handleOrderCreatedEvent(user: UserDocument) {
    const token = this._auth.createToken(user);
    const forgotLink = `${this.clientAppUrl}/auth/confirm/forgotPassword?token=${token}`;

    this._mailer.sendMail({
      to: user.email, // list of receivers
      subject: 'Has olvidado tu contraseña', // Subject line
      template: 'auth_forgot-password',
      context: {
        forgotLink,
        firstName: user.firstName,
      },
    });
  }
}
