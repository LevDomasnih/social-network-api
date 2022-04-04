import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MulterModule } from '@nestjs/platform-express';
import { PostsGateway } from './posts.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../users/user.entity';

@Module({
    controllers: [PostsController],
    imports: [
        TypeOrmModule.forFeature([PostEntity, UserEntity]),
        MulterModule.register({
            dest: './files',
        }),
        AuthModule,
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
