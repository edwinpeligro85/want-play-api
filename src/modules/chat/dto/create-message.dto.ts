import {
  IsDefined,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsMongoId()
  from: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  message: string;
}
