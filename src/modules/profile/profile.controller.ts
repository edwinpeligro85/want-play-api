import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowDto } from './dto/follow.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly _profile: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this._profile.findOne(id);
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
