import { User } from '@modules/users/schemas';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { Status } from '@modules/users/enums';
import { ChangePasswordDto, ForgotPasswordDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FacebookUser, JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtEnvironment } from '@interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _user: UsersService,
    private readonly _config: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(signUp: SignUpDto): Promise<Partial<User>> {
    const { name: firstName, ...res } = signUp;
    const { password, ...user } = (
      await this._user.create({ firstName, ...res })
    ).toObject();

    return user;
  }

  async validateUser(
    email: string,
    pwd: string,
  ): Promise<{ user: Partial<User>; exception: HttpException }> {
    const user = await this._user.findOneByEmail(email, true);

    if (!user) {
      return {
        user: null,
        exception: new HttpException('User not found', HttpStatus.UNAUTHORIZED),
      };
    }

    if (!bcrypt.compareSync(pwd, user.password)) {
      return {
        user: null,
        exception: new HttpException(
          'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        ),
      };
    }

    const { password, ...rest } = user.toObject();

    return { user: rest, exception: null };
  }

  async confirm(token: string): Promise<User> {
    const { sub } = await this.verifyToken(token);
    const user = await this._user.findOne(sub);

    if (user && user.status === Status.PENDING) {
      user.status = Status.ACTIVE;
      return this._user.update(user.id, user);
    }

    throw new BadRequestException('Confirmation error');
  }

  async login(user: User): Promise<LoginResponseDto> {
    return new LoginResponseDto(this.createToken(user), user);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    ip: string,
  ): Promise<void> {
    const user = await this._user.findOneByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    this.eventEmitter.emit('forgot-password', { user, ip });
  }

  async changePassword(
    userId: string,
    { password }: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this._user.findOne(userId, true);

    if (bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid change password');
    }

    await this._user.update(userId, { password });
    // TODO: Revocar tokens
    return true;
  }

  createToken(user: User): string {
    return this._jwt.sign(this.generateJwtPayload(user));
  }

  public createCookieRefreshToken(user: User) {
    const payload = this.generateJwtPayload(user);
    const refresh = this._config.get<JwtEnvironment>('jwt').refresh;
    const token = this._jwt.sign(payload, {
      secret: refresh.secret,
      expiresIn: refresh.expirationTime,
    });

    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=604800`;
  }

  public getCookiesForLogOut() {
    return ['Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }

  private generateJwtPayload(user: User): JwtPayload {
    return {
      email: user.email,
      sub: user['_id'],
      profileId: user.profile['_id'] ?? (user.profile as any),
    };
  }

  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this._jwt.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  public async facebookLogin(fb: FacebookUser): Promise<string> {
    let user = await this._user.findOneByEmail(fb.email);

    if (!user) {
      const userCreated = new User(fb);
      userCreated.status = Status.ACTIVE;
      userCreated.password = fb.facebookId;

      user = await this._user.create(userCreated);
    } else if (!user.facebookId) {
      user.facebookId = fb.facebookId;
      this._user.update(user.id, user);
    }

    return this.createToken(user);
  }
}
