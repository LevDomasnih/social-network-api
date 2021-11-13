import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';
import { unlink } from 'fs/promises';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
    ) {
    }

    async createPost(user: UserModel, file: Express.Multer.File, dto: CreatePostRequestDto) {
        try {
            const newPost = await this.postsModel.create({
                image: file?.filename || '',
                owner: user._id,
                ...dto,
            });

            await this.userModel.findOneAndUpdate(
                { _id: user._id },
                { $push: { posts: newPost._id } },
            );

            return newPost;

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async createComment(
        user: UserModel, parentId: string,
        file: Express.Multer.File, dto: CreatePostRequestDto
    ) {
      try {
          const parentPost = await this.postsModel.findById(parentId);

          if (!parentPost) {
              throw new BadRequestException('Пост не существует');
          }

          const newPost = await this.postsModel.create({
              image: file.filename || '',
              owner: user._id,
              ...dto,
          });

          const createdPost = await this.postsModel.findOneAndUpdate(
              { _id: parentId },
              { $push: { comments: newPost._id } },
              { new: true },
          )
              .populate({
                  path: 'comments',
                  model: PostsModel,
                  transform: (doc: PostsModel) => {
                      doc.image = `http://localhost:3000/files/${doc.image}`
                      return doc
                  }
              });

          if (!createdPost) { throw new BadRequestException('Пост не был создан')}

          return createdPost

      } catch (e) {
          throw new BadRequestException(e)
      }
    }

    async updatePost(
        user: UserModel, id: string,
        file: Express.Multer.File, {text}: CreatePostRequestDto
    ) {
        try {
            const oldPost = await this.postsModel.findById(id).exec()

            const oldImageName = oldPost?.image

            if (oldImageName) {
                await unlink(`files/${oldImageName}`)
            }

            const updatedPost = await this.postsModel.findOneAndUpdate(
                {_id: id},
                {
                    text,
                    image: file.filename
                },
                {new: true}
            )

            if (!updatedPost) { throw new BadRequestException('Пост не был обновлен') }

            return updatedPost

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getPost() {

    }

    async getPostsOfUser(id: string) {
        const posts = await this.userModel.findById(id)
            .populate({
                path: 'posts',
                model: PostsModel,
                populate: {
                    path: 'comments',
                    model: PostsModel,
                },
            }).exec()
            .then(doc => {
                return doc?.posts;
            });

        if (!posts) { throw new BadRequestException('Постов нет')}

        return posts
    }

    async getPosts() {

    }

    async deletePost() {

    }
}
