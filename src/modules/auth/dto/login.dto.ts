import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString({ always: true })
  @IsEmail({}, { always: true })
  readonly email: string;

  @IsNotEmpty()
  @IsString({ always: true })
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
