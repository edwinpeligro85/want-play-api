import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiHideProperty } from '@nestjs/swagger';
import { Status } from '../enums';
import { IUser } from '@interfaces';
import { isNotEmpty } from 'class-validator';
import { TimestampsModel } from '@common/schemas';
import { Profile } from '@modules/profile/schemas';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends TimestampsModel<User> implements IUser {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Profile.name })
  profile: Profile;

  async checkPassword?(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaProvider = {
  name: User.name,
  useFactory: () => {
    const schema = UserSchema;

    schema.pre<User>('save', function (next: Function) {
      const user = this;

      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
        next();
      }
    });

    return schema;
  },
};
