import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '@modules/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _config: ConfigService,
    private readonly _user: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get<string>(Config.JWT_SECRET),
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
