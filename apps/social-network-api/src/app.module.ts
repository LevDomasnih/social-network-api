import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { ProfileModule } from './app/profile/profile.module';
import { UsersModule } from './app/users/users.module';
import { FollowModule } from './app/follow/follow.module';
import { PostsModule } from './app/posts/posts.module';
import { DialogsModule } from './app/dialogs/dialogs.module';
import { MessagesModule } from './app/messages/messages.module';
import { FilesModule } from './app/files/files.module';
import { NestPostgreModule } from '@app/nest-postgre';
import { SharedModule } from '@app/common/shared.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    NestPostgreModule,
    AuthModule,
    ProfileModule,
    UsersModule,
    FollowModule,
    PostsModule,
    DialogsModule,
    MessagesModule,
    FilesModule
  ]
})
export class AppModule {}
