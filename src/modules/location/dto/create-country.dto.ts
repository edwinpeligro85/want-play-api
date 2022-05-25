import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCountryDto {

  /**
   * @example Colombia
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform((attr) => attr.value.toLowerCase())
  name: string;
}
