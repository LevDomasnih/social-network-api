import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostDto } from './dto/create-post.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
    ) { }

    async createPost(file: Express.Multer.File, dto: CreatePostDto) {

        const user = await this.userModel.findById(dto.owner)

        if (!user) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        const newPost = await this.postsModel.create({
            image: file.filename,
            ...dto
        })

        await this.userModel.findOneAndUpdate(
            { _id: dto.owner },
            { $push: { posts: newPost._id } }
        ).exec()

        return newPost
    }
}
