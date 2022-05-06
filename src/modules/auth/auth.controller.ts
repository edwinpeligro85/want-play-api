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
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUpDto): Promise<User> {
    return this._auth.register(signUp);
  }
}
