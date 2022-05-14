import { Auth, AuthUser } from '@common/decorators';
import { User } from '@modules/users/esquemas';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Req,
  Ip,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
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
  // @UseInterceptors(TokenInterceptor)
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
  // @UseInterceptors(TokenInterceptor)
  async login(
    @Body() _: LoginDto,
    @AuthUser() user: User,
  ): Promise<LoginResponseDto> {
    return this._auth.login(user);
  }

  @Auth()
  @Get('me')
  async getMe(@Req() request: Request): Promise<User> {
    return request['user'] as User;
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Ip() ip: string,
  ): Promise<boolean> {
    await this._auth.forgotPassword(forgotPasswordDto, ip);
    return true;
  }
}
