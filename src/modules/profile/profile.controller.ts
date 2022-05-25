import { Auth } from '@common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowDto } from './dto/follow.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas';

@Auth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly _profile: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this._profile.findOne(id);
  }

  @Get(':id/followers')
  followers(
    @Param('id') id: string,
    @Query('full') full: boolean = false,
  ): Promise<Profile[]> {
    return this._profile.followers(id, full);
  }

  @Get(':id/followers_count')
  followersCount(@Param('id') id: string): Promise<number> {
    return this._profile.followersCount(id);
  }

  @Get(':id/following')
  following(
    @Param('id') id: string,
    @Query('full') full: boolean = false,
  ): Promise<Profile[]> {
    return this._profile.following(id, full);
  }

  @Get(':id/following_count')
  followingCount(@Param('id') id: string): Promise<number> {
    return this._profile.followingCount(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateprofileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this._profile.update(id, updateprofileDto);
  }

  @Put(':id/following/:target')
  follow(@Param() dto: FollowDto): Promise<void> {
    return this._profile.follow(dto.id, dto.target);
  }

  @Delete(':id/following/:target')
  unfollow(@Param() dto: FollowDto): Promise<void> {
    return this._profile.unfollow(dto.id, dto.target);
  }
}
