import { Body, Controller, Delete, Put, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async follow(@Body() dto: FollowDto) {
        return this.followService.follow(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async unfollow(@Body() dto: FollowDto) {
        // return this.followService.unfollow(dto);
    }
}
