export class Base<Type> {
  _id: string;

  get id() {
    return this._id;
  }

  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Type> = {}) {
    Object.assign(this, data);
  }
}
