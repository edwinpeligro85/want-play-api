import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxDate } from 'class-validator';
import { Gender } from '../enums';

export class UpdateProfileDto {
  @IsOptional()
  gender: Gender;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date((new Date()).setMonth(-(12 * 13))))
  @Transform((attr) => new Date(attr.value))
  birthDate: Date;

  @IsOptional()
  @IsString()
  aboutMe: string;

  @IsOptional()
  @IsString()
  nickname: string;
}
