import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
    controllers: [FollowController],
    imports: [],
    exports: [FollowService],
    providers: [FollowService],
})
export class FollowModule {
}
