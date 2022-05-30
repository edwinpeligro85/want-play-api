import { LocationService } from '@modules/location';
import { PostsService } from '@modules/posts';
import { User } from '@modules/users/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { ClientSession, Connection, Model } from 'mongoose';
import { ProfileResponseDto } from './dto/profile-response.dto';
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
    private _posts: PostsService,
    private _location: LocationService,
  ) {}

  async findOne(id: string): Promise<ProfileResponseDto> {
    const profile = await this.profileModel
      .findById(id)
      .populate({
        path: 'city',
        populate: {
          path: 'state',
          model: 'State',
          populate: {
            path: 'country',
            model: 'Country',
          }
        },
      })
      .exec();

    if (!profile) {
      throw new NotFoundException(`Profile ${id} not found`);
    }

    const response = new ProfileResponseDto(profile.toObject());
    response.posts = await this._posts.userPostCount(id);
    response.followers = await this.followersCount(id);
    response.following = await this.followingCount(id);

    return response;
  }

  async create({ _id, firstName }: User) {
    const createdProfile = new this.profileModel({
      age: 0,
      user: _id,
      nickname: `${firstName.substring(0, 3)}${Math.floor(
        Math.random() * (999 + 1 - 0) + 0,
      )}`,
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

    if (!(await this._location.cityExists(updatedProfile.city))) {
      throw new BadRequestException(`Not exist city ${updatedProfile.city}`);
    }

    await this.profileModel.updateOne({ _id }, updatedProfile).exec();

    return this.profileModel.findById(_id).exec();
  }

  async follow(follower: string, toFollow: string) {
    let session: ClientSession = null;

    if (follower === toFollow) {
      throw new BadRequestException('Profile can not be followed yourself');
    }

    if (!(await this.findOne(follower)) || !(await this.findOne(toFollow))) {
      throw new BadRequestException('Profile no exist');
    }

    if (
      await this.followerModel.exists({ follower, followerOf: toFollow }).exec()
    ) {
      throw new BadRequestException(
        `Profile ${follower} already follow at ${toFollow}`,
      );
    }

    return this.connection
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();

        return this.followerModel.create([{ follower, followerOf: toFollow }], {
          session: session,
        });
      })
      .then(() => {
        return this.followingModel.create(
          [{ followingOf: toFollow, following: follower }],
          {
            session: session,
          },
        );
      })
      .then(() => session.commitTransaction())
      .then(() => session.endSession());
  }

  async unfollow(follower: string, toRemove: string) {
    let session: ClientSession = null;

    if (!(await this.findOne(follower)) || !(await this.findOne(toRemove))) {
      throw new BadRequestException('Profile no exist');
    }

    if (
      !(await this.followerModel
        .exists({ follower, followingOf: toRemove })
        .exec())
    ) {
      throw new BadRequestException(
        `Profile ${follower} not follow at ${toRemove}`,
      );
    }

    return this.connection
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();

        return this.followerModel
          .deleteOne({ follower, followerOf: toRemove })
          .session(session);
      })
      .then(() => {
        return this.followingModel
          .deleteOne({ followingOf: toRemove, following: follower })
          .session(session);
      })
      .then(() => session.commitTransaction())
      .then(() => session.endSession());
  }

  async followers(id: string, fullProfile: boolean): Promise<Profile[]> {
    const query = this.followerModel
      .where({ followerOf: id })
      .select('follower');

    if (fullProfile) {
      query.populate(['follower']);
    }

    return (await query.exec()).map((res) => res.follower);
  }

  async followersCount(id: string): Promise<number> {
    return this.followerModel.count({ followerOf: id }).exec();
  }

  async following(id: string, fullProfile: boolean): Promise<Profile[]> {
    const query = this.followingModel.where({ following: id });

    if (fullProfile) {
      query.populate(['followingOf']);
    }

    return (await query.exec()).map((res) => res.followingOf);
  }

  async followingCount(id: string): Promise<number> {
    return this.followingModel.count({ following: id }).exec();
  }
}
