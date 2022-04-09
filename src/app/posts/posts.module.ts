import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MulterModule } from '@nestjs/platform-express';
import { PostsGateway } from './posts.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
    controllers: [PostsController],
    imports: [
        TypeOrmModule.forFeature([PostsRepository, UsersRepository]),
        MulterModule.register({
            dest: './files',
        }),
        AuthModule,
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
