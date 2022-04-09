import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { AuthModule } from '../auth/auth.module';
import { FollowRepository } from './follow.repository';
import { SubscribersRepository } from './subscribers.repository';

@Module({
    controllers: [FollowController],
    imports: [
        TypeOrmModule.forFeature([FollowRepository, UsersRepository, SubscribersRepository]),
        AuthModule,
    ],
    exports: [FollowService],
    providers: [FollowService],
})
export class FollowModule {
}
