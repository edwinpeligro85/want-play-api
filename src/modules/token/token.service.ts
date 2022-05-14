import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { Token, TokenDocument } from './schemas/user-token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<TokenDocument> {
    const userToken = new this.tokenModel(createUserTokenDto);
    return userToken.save();
  }

  async delete(uId: string, token: string) {
    return this.tokenModel.deleteOne({ uId, token }).exec();
  }

  async deleteAll(uId: string) {
    return this.tokenModel.deleteMany({ uId }).exec();
  }

  async exists(uId: string, token: string) {
    return this.tokenModel.exists({ uId, token }).exec();
  }
}
