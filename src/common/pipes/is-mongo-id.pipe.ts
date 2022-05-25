import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class IsMongoIdPipe implements PipeTransform {
  transform(value: string, { type, data }: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new UnprocessableEntityException(
        `The ${type} '${data}' must be a mongodb id`,
      );
    }

    return value;
  }
}
