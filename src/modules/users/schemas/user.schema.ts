import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiHideProperty } from '@nestjs/swagger';
import { Status } from '../enums';
import { IUser } from '@interfaces';
import { isNotEmpty } from 'class-validator';
import { Base } from '@common/schemas';

export type UserDocument = User & Document;

@Schema()
export class User extends Base<User> implements IUser {
  get thirdPartyAuth(): boolean {
    return isNotEmpty(this.facebookId);
  }

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop({ unique: true, type: 'string', required: true, maxlength: 255 })
  email: string;

  @ApiHideProperty()
  @Prop({ select: false })
  password?: string;

  @Prop({ enum: Object.values(Status), default: Status.PENDING, maxlength: 10 })
  status: Status;

  @Prop({ maxlength: 20 })
  facebookId?: string;

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
