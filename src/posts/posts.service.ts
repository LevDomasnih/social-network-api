import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
    ) { }
}
