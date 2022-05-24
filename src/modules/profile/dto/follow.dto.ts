import { IsDefined, IsMongoId } from 'class-validator';

export class FollowDto {
  @IsDefined()
  @IsMongoId()
  id: string;

  @IsDefined()
  @IsMongoId()
  target: string;
}
