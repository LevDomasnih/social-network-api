import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Global()
@Module({
    imports: [
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
