import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileRequestDto } from './dto/update-profile/update-profile-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';
import { UpdateProfileResponseDto } from './dto/update-profile/update-profile-response.dto';
import { FindProfileResponseDto } from './dto/find-profile/find-profile-response.dto';

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
        type: UpdateProfileResponseDto,
    })
    async update(
        @User() user: UserEntity,
        @Body() dto: UpdateProfileRequestDto,
    ): Promise<UpdateProfileResponseDto> {
        return this.profileService.updateProfile(user, dto);
    }

    @Get(':userId')
    @ApiCreatedResponse({
        description: 'Get user profile by user id',
        type: FindProfileResponseDto,
    })
    async get(@Param('userId', IdValidationPipe) userId: string): Promise<FindProfileResponseDto> {
        return this.profileService.findProfile(userId);
    }
}
