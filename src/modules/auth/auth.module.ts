import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserCreatedListener } from './listeners/user-created.listener';
import { ForgotPasswordListener } from './listeners/forgot-password.listener';
import { Environment } from '@interfaces';
import { ProfileModule } from '@modules/profile';
import { UsersModule } from '@modules/users';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Environment>) => ({
        secret: config.get<string>('jwtSecret'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    UserCreatedListener,
    ForgotPasswordListener,
  ],
})
export class AuthModule {}
