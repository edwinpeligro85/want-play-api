import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { ClientSession, Connection, Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Follower,
  FollowerDocument,
  Following,
  FollowingDocument,
  Profile,
  ProfileDocument,
} from './schemas';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Follower.name) private followerModel: Model<FollowerDocument>,
    @InjectModel(Following.name)
    private followingModel: Model<FollowingDocument>,
    @InjectConnection() private connection: Connection,
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

  async follow(owner: string, toFollow: string) {
    let session: ClientSession = null;

    if (!(await this.findOne(owner)) && !(await this.findOne(toFollow))) {
      throw new BadRequestException('Profile no exist');
    }

    if (await this.followerModel.findOne({ owner, to: toFollow }).exec()) {
      throw new BadRequestException(
        `Profile ${owner} already follow at ${toFollow}`,
      );
    }

    return this.connection
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();

        return this.followerModel.create([{ owner, to: toFollow }], {
          session: session,
        });
      })
      .then(() => {
        return this.followingModel.create([{ owner: toFollow, to: owner }], {
          session: session,
        });
      })
      .then(() => session.commitTransaction())
      .then(() => session.endSession());
  }
}
