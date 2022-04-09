import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './common/configs/mongo.config';
import { AuthModule } from './app/auth/auth.module';
import { ProfileModule } from './app/profile/profile.module';
import { UsersModule } from './app/users/users.module';
import { FollowModule } from './app/follow/follow.module';
import { PostsModule } from './app/posts/posts.module';
import { DialogsModule } from './app/dialogs/dialogs.module';
import { MessagesModule } from './app/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
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
    MessagesModule
  ]
})
export class AppModule {}
