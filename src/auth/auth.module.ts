import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfileModule } from '../profile/profile.module';
import { UsersModule } from '../users/users.module';

@Module({
    controllers: [AuthController],
    imports: [
        forwardRef(() => UsersModule),
        ProfileModule,
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
export class AuthModule {}
