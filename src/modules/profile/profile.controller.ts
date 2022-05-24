import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly _profile: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile>{
    return this._profile.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateprofileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this._profile.update(id, updateprofileDto);
  }
}
