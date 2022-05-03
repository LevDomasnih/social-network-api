import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { ProfileModule } from './app/profile/profile.module';
import { UsersModule } from './app/users/users.module';
import { FollowModule } from './app/follow/follow.module';
import { PostsModule } from './app/posts/posts.module';
import { DialogsModule } from './app/dialogs/dialogs.module';
import { MessagesModule } from './app/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { FilesModule } from './app/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
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
