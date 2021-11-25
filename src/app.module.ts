import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';
import { FollowModule } from './follow/follow.module';
import { PostsModule } from './posts/posts.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    ProfileModule,
    UsersModule,
    FollowModule,
    PostsModule,
    DialogsModule,
    MessagesModule
  ]
})
export class AppModule {}
