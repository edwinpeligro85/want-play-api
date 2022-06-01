import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsMongoId,
} from 'class-validator';

export class CreateChatDto {
  @IsDefined()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(100)
  @IsMongoId({ each: true })
  members: string[];
}
