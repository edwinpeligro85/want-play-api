import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  get id() {
    return this['_id'];
  }

  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop()
  lastName?: string;

  @Prop()
  age?: number;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @Prop({ select: false })
  password?: string;

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
