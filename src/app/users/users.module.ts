import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { FollowEntity } from '../follow/follow.entity';
import { SubscribersEntity } from '../follow/subscribers.entity';

@Module({
    controllers: [UsersController],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, FollowEntity, SubscribersEntity]),
        AuthModule
    ],
    exports: [UsersService],
    providers: [UsersService]
})
export class UsersModule {
}
