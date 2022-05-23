import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create() {
    const createdProfile = new this.profileModel({
      age: 0,
      birthDate: new Date(),
      socialMedias: [],
    });
    return createdProfile.save();
  }

  getProfileByUserId(userId: string) {
    return this.profileModel.findOne({ userId: userId });
  }
}
