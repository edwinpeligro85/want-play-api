import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

// export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  constructor(data: Partial<User> = {}) {
    super();
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

          bcrypt.hash(user.password, salt, (err, hash) => {
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
