import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostDto } from './dto/create-post.dto';
import { Express } from 'express';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
    ) { }

    async createPost(file: Express.Multer.File, dto: CreatePostDto) {
        return this.postsModel.create({
            image: file.filename,
            ...dto
        })
    }
}
