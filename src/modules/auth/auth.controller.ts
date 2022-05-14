import { Auth, AuthUser } from '@common/decorators';
import { UsersService } from '@modules/users';
import { User } from '@modules/users/esquemas';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfirmAccountDto, LoginDto, LoginResponseDto, SignUpDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService, private _user: UsersService) {}

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

  @Auth({})
  @Get('me')
  async getMe(@Request() req: any): Promise<User> {
    console.log("🚀 ~ file: auth.controller.ts ~ line 52 ~ AuthController ~ getMe ~ req", req.user);
    return req.user;
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1emFAc2VndXJvcGFyYXZpYWplLmNvbSIsImlhdCI6MTY1MjU0OTgzNywiZXhwIjoxNjUyNTUzNDM3fQ.p75eeIWooo_y4byX72SNlEc39LSSnhZUUynDr2rsBrg