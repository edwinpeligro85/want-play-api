import { Base } from './base.schema';

export class TimestampsModel<Type> extends Base<Type> {
  createdAt: Date;
  updatedAt: Date;
}
