import { AuthUser } from '@common/decorators';
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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @Post('register')
  // @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUpDto): Promise<Partial<User>> {
    return this._auth.register(signUp);
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
}
