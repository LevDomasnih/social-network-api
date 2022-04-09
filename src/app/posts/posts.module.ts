import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MulterModule } from '@nestjs/platform-express';
import { PostsGateway } from './posts.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { PostsRepository } from './posts.repository';

@Module({
    controllers: [PostsController],
    imports: [
        TypeOrmModule.forFeature([PostsRepository, UserEntity]),
        MulterModule.register({
            dest: './files',
        }),
        AuthModule,
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
