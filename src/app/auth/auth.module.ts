import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../../common/configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { PostEntity } from '../posts/post.entity';
import { FollowEntity } from '../follow/follow.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProfileEntity, PostEntity, FollowEntity, UsersRepository]),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig
        }),
        PassportModule
    ],
    exports: [AuthService],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {
}
