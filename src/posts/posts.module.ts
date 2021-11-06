import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { MulterModule } from '@nestjs/platform-express';
import { UserModel } from '../users/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { PostsGateway } from './posts.gateway';

@Module({
    controllers: [PostsController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: PostsModel,
                schemaOptions: {
                    collection: 'Posts',
                },
            },
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User',
                },
            },
        ]),
        MulterModule.register({
            dest: './files',
        }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig
        }),
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
