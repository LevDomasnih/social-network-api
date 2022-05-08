import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsGateway } from './posts.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository, UsersRepository } from '@app/nest-postgre';

@Module({
    controllers: [PostsController],
    imports: [
        TypeOrmModule.forFeature([PostsRepository, UsersRepository]),
        AuthModule,
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
