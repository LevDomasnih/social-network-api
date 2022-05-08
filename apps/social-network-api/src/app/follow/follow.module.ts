import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FollowRepository, SubscribersRepository, UsersRepository } from '@app/nest-postgre';

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
