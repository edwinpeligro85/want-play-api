import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserCreatedEvent } from './events';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * "Create a new user and emit a user.created event."
   *
   * The first thing we do is create a new user using the data passed in. We then create a new
   * `UserCreatedEvent` and set the user property to the user we just created. Finally, we emit the
   * `user.created` event
   * @param data - `Partial<User>` - This is the data that will be used to create the user.
   * @returns A promise that resolves to a `UserDocument`
   */
  async create(data: Partial<User>): Promise<UserDocument> {
    const user = await new this.userModel(data).save();

    if (!user.thirdPartyAuth) {
      const userCreatedEvent = new UserCreatedEvent();
      userCreatedEvent.user = user;

      this.eventEmitter.emit('user.created', userCreatedEvent);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(
    id: string,
    password: boolean = false,
  ): Promise<UserDocument | undefined> {
    const user = this.userModel.findById(id);

    if (password) {
      user.select('+password');
    }

    return user.exec();
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    await this.userModel.updateOne({ _id }, updateUserDto).exec();

    return this.findOne(_id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(
    email: string,
    password: boolean = false,
  ): Promise<UserDocument> {
    const user = this.userModel.findOne({ email });

    if (password) {
      user.select('+password');
    }

    return user.exec();
  }

  async findOneByThirdPartyAuth(
    type: 'facebookId',
    clientId: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ [type]: clientId }).exec();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
