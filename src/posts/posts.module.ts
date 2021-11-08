import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { MulterModule } from '@nestjs/platform-express';
import { UserModel } from '../users/user.model';
import { PostsGateway } from './posts.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [PostsController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: PostsModel,
                schemaOptions: {
                    collection: 'Posts',
                },
            },
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User',
                },
            },
        ]),
        MulterModule.register({
            dest: './files',
        }),
        AuthModule
    ],
    providers: [PostsService, PostsGateway],
})
export class PostsModule {
}
