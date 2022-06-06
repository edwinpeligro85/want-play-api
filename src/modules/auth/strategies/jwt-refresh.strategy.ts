import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '@modules/users';
import { Environment, JwtEnvironment } from '@interfaces';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private _config: ConfigService<Environment>,
    private readonly _user: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: _config.get<JwtEnvironment>('jwt').refresh.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;

    const user = await this._user.findOne(id);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const { password, ...result } = user.toObject();

    return { ...result };
  }
}
