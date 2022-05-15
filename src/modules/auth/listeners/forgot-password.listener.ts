import { Environment } from '@interfaces';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../auth.service';
import { ForgotPassword } from '../interfaces/forgot-password.interface';

@Injectable()
export class ForgotPasswordListener {
  private clientAppUrl: string;

  constructor(
    private readonly _auth: AuthService,
    private readonly _mailer: MailerService,
    private _config: ConfigService<Environment>,
  ) {
    this.clientAppUrl = this._config.get<string>('clientAppUrl');
  }

  @OnEvent('forgot-password')
  handleOrderCreatedEvent({ user, ip }: ForgotPassword) {
    const token = this._auth.createToken(user);
    const forgotLink = `${this.clientAppUrl}/auth/confirm/forgotPassword?token=${token}`;

    this._mailer.sendMail({
      to: user.email, // list of receivers
      subject: 'Has olvidado tu contraseña', // Subject line
      template: 'auth_forgot-password',
      context: {
        ip,
        forgotLink,
        email: user.email,
        firstName: user.firstName,
        assets: this._config.get<string>('assets'),
      },
    });
  }
}
