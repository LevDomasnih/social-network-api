import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ProfileModel } from '../profile/profile.model';

@Module({
    controllers: [AuthController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User'
                }
            },
            {
                typegooseClass: ProfileModel,
                schemaOptions: {
                    collection: 'Profile'
                }
            }
        ]),
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
