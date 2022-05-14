import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiHideProperty } from '@nestjs/swagger';
import { Gender, Status } from '../enums';
import { IUser } from '@interfaces';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  get id(): string {
    return this['_id'];
  }

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop()
  age?: number;

  @Prop({ required: true })
  email: string;

  @ApiHideProperty()
  @Prop({ select: false })
  password?: string;

  @Prop({ enum: Object.values(Status), default: Status.PENDING })
  status: Status;

  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  async checkPassword?(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaProvider = {
  name: User.name,
  useFactory: () => {
    UserSchema.pre<User>('save', function (next: Function) {
      const user = this;
      if (user.password) {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) return next(err);

          bcrypt.hash(user.password, salt, (_, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
          });
        });
      }
    });

    return UserSchema;
  },
};
