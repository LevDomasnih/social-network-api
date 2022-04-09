import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';
import { UsersRepository } from '../users/users.repository';
import { AuthModule } from '../auth/auth.module';
import { SubscribersEntity } from './subscribers.entity';

@Module({
    controllers: [FollowController],
    imports: [
        TypeOrmModule.forFeature([FollowEntity, UsersRepository, SubscribersEntity]),
        AuthModule,
    ],
    exports: [FollowService],
    providers: [FollowService],
})
export class FollowModule {
}
