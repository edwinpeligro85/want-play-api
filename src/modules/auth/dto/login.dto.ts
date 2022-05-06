import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @IsEmail({}, { always: true })
  email: string;

  @ApiProperty({
    minLength: 6,
    maxLength: 20,
    example: '******',
  })
  @IsNotEmpty()
  @IsString({ always: true })
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
