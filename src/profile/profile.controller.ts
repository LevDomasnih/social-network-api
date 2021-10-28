import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('update')
    async update(@Body() dto: UpdateProfileDto) {
        return this.profileService.updateProfile(dto);
    }

    @Get(':userId')
    async get(@Param('userId') userId: string) {
        return this.profileService.findProfile(userId);
    }
}
