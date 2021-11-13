import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProfileResponseDto } from './dto/update-profile-response.dto';
import { GetProfileResponseDto } from './dto/get-profile-response.dto';
import { User } from '../decorators/user.decorator';
import { UserModel } from '../users/user.model';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @Post('update')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Update user profile',
        type: () => UpdateProfileResponseDto,
    })
    async update(
        @User() user: UserModel,
        @Body() dto: UpdateProfileRequestDto
    ): Promise<UpdateProfileResponseDto> {
        return this.profileService.updateProfile(user, dto);
    }

    @Get(':userId')
    @ApiCreatedResponse({
        description: 'Get user profile',
        type: () => GetProfileResponseDto,
    })
    async get(@Param('userId') userId: string): Promise<GetProfileResponseDto> {
        return this.profileService.findProfile(userId);
    }
}
