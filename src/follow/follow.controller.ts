import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowRequestDto } from './dto/follow-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FollowResponseDto } from './dto/follow-response.dto';
import { User } from '../decorators/user.decorator';
import { UserModel } from '../users/user.model';
import { UserEntity } from '../users/user.entity';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {
    }

    @Put(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Follow',
        type: FollowResponseDto,
    })
    async follow(@Param('userId', IdValidationPipe) subscriberId: string, @User() user: UserEntity) {
        return this.followService.follow(user.id, subscriberId);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Unfollow',
        type: FollowResponseDto,
    })
    async unfollow(@Param('userId', IdValidationPipe) subscriberId: string, @User() user: UserEntity) {
        return this.followService.unfollow(user.id, subscriberId);
    }
}
