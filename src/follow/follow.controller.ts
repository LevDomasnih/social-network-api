import { Body, Controller, Post } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @Post('follow')
    async follow(@Body() dto: FollowDto) {
        return this.followService.follow(dto)
    }

    @Post('unfollow')
    async unfollow(@Body() dto: FollowDto) {
        return this.followService.unfollow(dto)
    }
}
