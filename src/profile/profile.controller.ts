import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

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
    })
    async update(
        @User() user: UserEntity,
        @Body() dto: UpdateProfileRequestDto,
    ) {
        return this.profileService.updateProfile(user, dto);
    }

    @Get(':userId')
    @ApiCreatedResponse({
        description: 'Get user profile',
    })
    async get(@Param('userId', IdValidationPipe) userId: string) {
        return this.profileService.findProfile(userId);
    }
}
