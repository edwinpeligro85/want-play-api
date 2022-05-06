import { IsUserAlreadyExist } from '@modules/users/validators';
import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  // @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
