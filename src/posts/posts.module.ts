import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  controllers: [PostsController],
  imports: [
      TypegooseModule.forFeature([
        {
          typegooseClass: PostsService,
          schemaOptions: {
            collection: 'Posts'
          }
        }
      ])
  ],
  providers: [PostsService]
})
export class PostsModule {}
