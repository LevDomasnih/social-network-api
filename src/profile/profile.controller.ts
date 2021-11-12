import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileResponseDto } from './dto/update-profile-response.dto';
import { GetProfileResponseDto } from './dto/get-profile-response.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Update user profile',
        type: () => UpdateProfileResponseDto,
    })
    @Post('update')
    async update(@Body() dto: UpdateProfileRequestDto): Promise<UpdateProfileResponseDto | null> {
        return this.profileService.updateProfile(dto);
    }

    @ApiCreatedResponse({
        description: 'Get user profile',
        type: () => GetProfileResponseDto,
    })
    @Get(':userId')
    async get(@Param('userId') userId: string): Promise<GetProfileResponseDto | null> {
        return this.profileService.findProfile(userId);
    }
}
