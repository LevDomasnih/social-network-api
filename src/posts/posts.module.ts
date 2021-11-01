import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { MulterModule } from '@nestjs/platform-express';

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
        ]),
        MulterModule.register({
            dest: './files',
        }),
    ],
    providers: [PostsService],
})
export class PostsModule {
}
