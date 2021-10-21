import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @UseGuards(JwtAuthGuard)
    @Post('follow')
    async follow(@Body() dto: FollowDto) {
        return this.followService.follow(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollow')
    async unfollow(@Headers() headers: any, @Body() dto: FollowDto) {
        return this.followService.unfollow(dto)
    }
}
