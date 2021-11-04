import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostDto } from './dto/create-post.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';

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
            ...dto,
        })

        await this.userModel.findOneAndUpdate(
            { _id: dto.owner },
            { $push: { posts: newPost._id } }
        )

        return newPost
    }

    async createComment() {

    }

    async updatePost() {

    }

    async getPost() {

    }

    async getPostsOfUser(id: Types.ObjectId) {
        return this.userModel.findById(id)
            .populate({
                path: 'posts',
                model: PostsModel,
                populate: {
                    path: 'comments',
                    model: PostsModel
                }
            }).exec()
            .then(doc => {
                return doc?.posts
            })
    }

    async getPosts() {

    }

    async deletePost() {

    }

    async test() {
        const nestId = '6182e2af813926336a926665'
        const _id = '6182e35bf30c4d25f49ffcef'

        const nestPost = await this.postsModel.findById(nestId)

        if (!nestPost) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        return  this.postsModel.findOneAndUpdate(
            { _id },
            { $push: { comments: nestPost._id } },
            {new: true}
        )
    }
}
