import { User } from '@modules/users/esquemas';
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
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { Status } from '@modules/users/enums';
import { ForgotPasswordDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(private readonly _user: UsersService, private _jwt: JwtService, private eventEmitter: EventEmitter2) {}

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
  ): Promise<{ user: Partial<User>; message: HttpException }> {
    const user = await this._user.findOneByEmail(email, true);

    if (!user) {
      return {
        user: null,
        message: new HttpException('User not found', HttpStatus.UNAUTHORIZED),
      };
    }

    if (!(await bcrypt.compare(pwd, user.password))) {
      return {
        user: null,
        message: new HttpException(
          'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        ),
      };
    }

    const { password, ...rest } = user.toObject();

    return { user: rest, message: null };
  }

  async confirm(token: string): Promise<User> {
    const { sub } = this._jwt.verify<JwtPayload>(token);
    const user = await this._user.findOne(sub);

    // // await this._token.delete(sub, token);

    if (user && user.status === Status.PENDING) {
      user.status = Status.ACTIVE;
      return this._user.update(user.id, user);
    }

    throw new BadRequestException('Confirmation error');
  }

  async login(user: User): Promise<LoginResponseDto> {
    return new LoginResponseDto(this.createToken(user), user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this._user.findOneByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    this.eventEmitter.emit('forgot-password', user);

    // const token = this.createToken(user);
    // const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

    // await this.mailService.send({
    //   from: this.configService.get<string>('JS_CODE_MAIL'),
    //   to: user.email,
    //   subject: 'Forgot Password',
    //   html: `
    //         <h3>Hello ${user.firstName}!</h3>
    //         <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
    //     `,
    // });
  }

  createToken(user: User): string {
    const payload: JwtPayload = { email: user.email, sub: user['_id'] };
    return this._jwt.sign(payload);
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const data = this._jwt.verify<JwtPayload>(token);
      // const tokenExists = await this._token.exists(data.sub, token);

      // if (tokenExists) {
      return data;
      // }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
