import { Auth, AuthUser } from '@common/decorators';
import { IUser } from '@interfaces';
import { User } from '@modules/users/esquemas';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Ip,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ConfirmAccountDto,
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  SignUpDto,
} from './dto';
import { LocalAuthGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

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
    return this._auth.login(user);
  }

  /**
   * Get current user
   * @returns User
   */
  @Auth()
  @Get('me')
  async getMe(@AuthUser() user: IUser): Promise<User> {
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
}
