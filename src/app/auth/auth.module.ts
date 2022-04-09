import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../../common/configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from '../posts/posts.repository';
import { ProfileRepository } from '../profile/profile.repository';
import { FollowRepository } from '../follow/follow.repository';

@Module({
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([UsersRepository, ProfileRepository, PostsRepository, FollowRepository]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig,
        }),
        PassportModule,
    ],
    exports: [AuthService],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {
}
