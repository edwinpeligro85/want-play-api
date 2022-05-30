import { Auth, AuthUser } from '@common/decorators';
import { Environment, IUser } from '@interfaces';
import { ProfileService } from '@modules/profile';
import { User } from '@modules/users/schemas';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Ip,
  Patch,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ConfirmAccountDto,
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  SignUpDto,
} from './dto';
import { FacebookAuthGuard, LocalAuthGuard } from './guards';
import { FacebookPayload } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _auth: AuthService,
    private readonly _config: ConfigService<Environment>,
    private readonly _profile: ProfileService,
  ) {}

  @Post('register')
  async register(@Body() signUp: SignUpDto): Promise<User> {
    return this._auth.register(signUp) as any;
  }

  @Get('confirm')
  async confirm(@Query() query: ConfirmAccountDto): Promise<boolean> {
    await this._auth.confirm(query.token);
    return true;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() _: LoginDto,
    @AuthUser() user: User,
  ): Promise<LoginResponseDto> {
    user.profile = await this._profile.findOne(
      user.profile['_id'] ?? (user.profile as any),
    );

    return this._auth.login(user);
  }

  /**
   * Get current user
   * @returns User
   */
  @Auth()
  @Get('me')
  async getMe(@AuthUser() user: IUser): Promise<User> {
    user.profile = await this._profile.findOne(
      user.profile['_id'] ?? user.profile,
    );

    return user as User;
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Ip() ip: string,
  ): Promise<boolean> {
    await this._auth.forgotPassword(forgotPasswordDto, ip);
    return true;
  }

  @Auth()
  @Patch('/changePassword')
  async changePassword(
    @AuthUser() user: IUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this._auth.changePassword(user._id, changePasswordDto);
  }

  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin(): Promise<number> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookLoginRedirect(
    @Res() res: Response,
    @AuthUser() payload: FacebookPayload,
  ): Promise<any> {
    if (!payload) {
      return res.redirect(
        this._config.get<string>('clientAppUrl') + '/auth/sign-in',
      );
    }

    const accessToken = await this._auth.facebookLogin(payload.user);

    return res.redirect(
      this._config.get<string>('clientAppUrl') +
        '/auth/third-party-redirect?token=' +
        accessToken,
    );
  }
}
