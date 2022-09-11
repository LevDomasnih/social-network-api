import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { ProfileModule } from './app/profile/profile.module';
import { UsersModule } from './app/users/users.module';
import { FollowModule } from './app/follow/follow.module';
import { BlogsModule } from './app/blogs/blogs.module';
import { DialogsModule } from './app/dialogs/dialogs.module';
import { MessagesModule } from './app/messages/messages.module';
import { FilesModule } from './app/files/files.module';
import {
    BlogRepository,
    BlogTextBlockRepository,
    DialogsRepository,
    FilesRepository,
    FollowRepository,
    MessagesRepository,
    NestPostgreModule,
    PostRepository,
    ProfileRepository,
    SubscribersRepository,
    UsersRepository,
} from '@app/nest-postgre';
import { SharedModule } from '@app/common/shared.module';
import { StaticModule } from './app/static/static.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './app/posts/posts.module';
import { GraphqlLibModule } from '@app/graphql-lib';
import { PubSubModule } from './pub-sub/pub-sub.module';
import * as redisStore from 'cache-manager-redis-store'

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: 120
            })
        }),
        // конфиг модули
        SharedModule,
        ConfigModule.forRoot(),
        NestPostgreModule,
        TypeOrmModule.forFeature([
            UsersRepository,
            PostRepository,
            ProfileRepository,
            BlogRepository,
            FollowRepository,
            BlogTextBlockRepository,
            DialogsRepository,
            MessagesRepository,
            SubscribersRepository,
            FilesRepository,
        ]),
        GraphqlLibModule,
        // модули доменов
        AuthModule,
        ProfileModule,
        UsersModule,
        FollowModule,
        BlogsModule,
        DialogsModule,
        MessagesModule,
        FilesModule,
        StaticModule,
        PostsModule,
        PubSubModule,
    ],
    exports: [
        // сущности
        TypeOrmModule,
        // общий модуль для получения jwt
        AuthModule
    ],
})
export class AppModule {
}
