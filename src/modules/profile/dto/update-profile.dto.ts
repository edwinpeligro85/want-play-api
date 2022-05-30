import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MaxDate,
} from 'class-validator';
import { Gender, SocialMedia as SocialMediaEnum } from '../enums';

export class UpdateProfileDto {
  @IsOptional()
  gender?: Gender;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date(new Date().setMonth(-(12 * 13))))
  @Transform((attr) => new Date(attr.value))
  birthDate?: Date;

  @IsOptional()
  @IsString()
  aboutMe?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsMongoId()
  city: string;

  @IsOptional()
  @IsArray()
  socialMedias?: SocialMedia[];
}

export class SocialMedia {
  @IsDefined()
  @IsUrl()
  link: string;

  @IsDefined()
  @IsEnum(SocialMediaEnum)
  name: SocialMediaEnum;
}
