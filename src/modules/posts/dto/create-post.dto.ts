import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';

export class CreatePostDto {
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.OPEN;

  @IsDefined()
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @MaxLength(500)
  body: string;

  @IsDefined()
  @IsMongoId()
  city: string;
}
