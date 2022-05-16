import { AuthEnvironment, Environment } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { FacebookPayload, FacebookUser } from '../interfaces';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private _config: ConfigService<Environment>) {
    super({
      clientID: _config.get<AuthEnvironment>('auth').fb.id,
      clientSecret: _config.get<AuthEnvironment>('auth').fb.secret,
      callbackURL: `${_config.get<string>('appUrl')}/${_config.get<string>(
        'apiPrefix',
      )}/auth/facebook/redirect`,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    __: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user: FacebookUser = {
      email: emails[0].value,
      lastName: name.familyName,
      firstName: name.givenName,
      facebookId: id,
    };
    const payload: FacebookPayload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
