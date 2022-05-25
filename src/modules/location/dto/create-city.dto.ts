import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCityDto {
  /**
   * @example Pereira
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform((attr) => attr.value.toLowerCase())
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  state: string;
}
