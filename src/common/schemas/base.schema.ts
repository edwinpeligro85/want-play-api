export class Base<Type> {
  _id: string;

  get id() {
    return this._id;
  }

  constructor(data: Partial<Type> = {}) {
    Object.assign(this, data);
  }
}
