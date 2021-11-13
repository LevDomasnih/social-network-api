import { Body, Controller, Delete, Put, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowRequestDto } from './dto/follow-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FollowResponseDto } from './dto/follow-response.dto';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Follow',
        type: FollowResponseDto,
    })
    async follow(@Body() dto: FollowRequestDto): Promise<FollowResponseDto> {
        return this.followService.follow(dto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Unfollow',
        type: FollowResponseDto,
    })
    async unfollow(@Body() dto: FollowRequestDto): Promise<FollowResponseDto> {
        return this.followService.unfollow(dto);
    }
}
