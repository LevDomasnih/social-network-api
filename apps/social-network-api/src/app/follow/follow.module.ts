import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';

@Module({
    imports: [],
    exports: [FollowService],
    providers: [FollowService],
})
export class FollowModule {
}
