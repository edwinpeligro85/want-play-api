import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import {
  FacebookStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserCreatedListener } from './listeners/user-created.listener';
import { ForgotPasswordListener } from './listeners/forgot-password.listener';
import { Environment, JwtEnvironment } from '@interfaces';
import { ProfileModule } from '@modules/profile';
import { UsersModule } from '@modules/users';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (_config: ConfigService<Environment>) => ({
        secret: _config.get<JwtEnvironment>('jwt').access.secret,
        signOptions: {
          expiresIn: _config.get<JwtEnvironment>('jwt').access.expirationTime,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    FacebookStrategy,
    UserCreatedListener,
    ForgotPasswordListener,
  ],
})
export class AuthModule {}
