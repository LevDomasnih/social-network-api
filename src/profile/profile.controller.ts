import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @UsePipes(new ValidationPipe())
    @Post('update')
    async update(@Body() dto: UpdateProfileDto) {
        return this.profileService.updateProfile(dto)
    }

    @UsePipes(new ValidationPipe())
    @Get(':id')
    async get(@Param('id') id: string) {
        return this.profileService.findProfile(id)
    }
}
