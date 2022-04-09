import { Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';
import { FollowResponseDto } from './dto/follow/follow.response.dto';
import { UnfollowResponseDto } from './dto/unfollow/unfollow.response.dto';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {
    }

    @Put(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Follow',
    })
    async follow(
        @Param('userId', IdValidationPipe) subscriberId: string,
        @User() user: UserEntity
    ): Promise<FollowResponseDto> {
        return this.followService.follow(user.id, subscriberId);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Unfollow',
    })
    async unfollow(
        @Param('userId', IdValidationPipe) subscriberId: string,
        @User() user: UserEntity
    ): Promise<UnfollowResponseDto> {
        return this.followService.unfollow(user.id, subscriberId);
    }
}
