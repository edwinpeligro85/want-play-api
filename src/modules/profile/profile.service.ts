import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, ProfileDocument } from './schemas';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async findOne(id: string): Promise<ProfileDocument | undefined> {
    return this.profileModel.findById(id).exec();
  }

  async create() {
    const createdProfile = new this.profileModel({
      age: 0,
      birthDate: new Date(),
      socialMedias: [],
    });
    return createdProfile.save();
  }

  async update(
    _id: string,
    updatedProfile: UpdateProfileDto,
  ): Promise<Profile> {
    if (updatedProfile.birthDate) {
      updatedProfile['age'] = moment().diff(
        moment(updatedProfile.birthDate),
        'years',
      );
    }

    await this.profileModel.updateOne({ _id }, updatedProfile).exec();

    return this.profileModel.findById(_id).exec();
  }

  getProfileByUserId(userId: string) {
    return this.profileModel.findOne({ userId: userId });
  }
}
