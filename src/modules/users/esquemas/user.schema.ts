import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiHideProperty } from '@nestjs/swagger';
import { Gender, Status } from '../enums';
import { IUser } from '@interfaces';
import { isNotEmpty } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  get id(): string {
    return this['_id'];
  }

  get thirdPartyAuth(): boolean {
    return isNotEmpty(this.facebookId);
  }

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop()
  age?: number;

  @Prop({ required: true, maxlength: 255 })
  email: string;

  @ApiHideProperty()
  @Prop({ select: false })
  password?: string;

  @Prop({ enum: Object.values(Status), default: Status.PENDING, maxlength: 10 })
  status: Status;

  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;

  @Prop({ maxlength: 20 })
  facebookId?: string;

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
