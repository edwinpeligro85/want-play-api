import { IsUserAlreadyExist } from '@modules/users/validators';
import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @MaxLength(255, { always: true })
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
