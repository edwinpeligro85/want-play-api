import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStateDto {
  /**
   * @example Risaralda
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform((attr) => attr.value.toLowerCase())
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  country: string;
}
