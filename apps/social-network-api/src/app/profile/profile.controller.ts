import { Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EditAvatarResponse, EditProfileResponseDto, FindProfileResponseDto, UpdateProfileRequestDto } from './dto';
import { IdValidationPipe, User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @Post('edit')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Update user profile',
        type: EditProfileResponseDto,
    })
    async edit(
        @User() user: UserEntity,
        @Body() dto: UpdateProfileRequestDto,
    ): Promise<EditProfileResponseDto> {
        return this.profileService.editProfile(user, dto);
    }

    @Get(':userId')
    @ApiCreatedResponse({
        description: 'Get user profile by user id',
        type: FindProfileResponseDto,
    })
    async get(@Param('userId', IdValidationPipe) userId: string): Promise<FindProfileResponseDto> {
        return this.profileService.findProfile(userId);
    }

    @Post('editImg/:field')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('image'))
    @ApiCreatedResponse({
        description: 'Update img',
        type: EditAvatarResponse,
    })
    async editImg(
        @Param('field') field: 'avatar' | 'mainImage',
        @UploadedFiles() files: Express.Multer.File[], @User() user: UserEntity) {
        return this.profileService.editImage(files, user, field);
    }
}
