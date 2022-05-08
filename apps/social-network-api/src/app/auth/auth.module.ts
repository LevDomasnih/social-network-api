import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository, PostsRepository, ProfileRepository, UsersRepository } from '@app/nest-postgre';
import { getJWTConfig } from '@app/common';

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
