import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';
import { unlink } from 'fs/promises';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
        private readonly authService: AuthService,
    ) {
    }

    async createPost(authorization: string, file: Express.Multer.File, dto: CreatePostRequestDto) {
        try {
            const user = await this.authService.verifyUser(authorization);

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
        authorization: string, parentId: string,
        file: Express.Multer.File, dto: CreatePostRequestDto
    ) {
      try {
          const user = await this.authService.verifyUser(authorization);

          const parentPost = await this.postsModel.findById(parentId);

          if (!parentPost) {
              throw new BadRequestException('Пост не существует');
          }

          const newPost = await this.postsModel.create({
              image: file.filename || '',
              owner: user._id,
              ...dto,
          });

          return this.postsModel.findOneAndUpdate(
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

      } catch (e) {
          throw new BadRequestException(e)
      }
    }

    async updatePost(
        authorization: string, id: string,
        file: Express.Multer.File, {text}: CreatePostRequestDto
    ) {
        try {

            const user = await this.authService.verifyUser(authorization, { posts: {$in: [id]} });

            const oldPost = await this.postsModel.findById(id).exec()

            const oldImageName = oldPost?.image

            if (oldImageName) {
                await unlink(`files/${oldImageName}`)
            }

            return this.postsModel.findOneAndUpdate(
                {_id: id},
                {
                    text,
                    image: file.filename
                },
                {new: true}
            )

        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async getPost() {

    }

    async getPostsOfUser(id: string) {
        return this.userModel.findById(id)
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
    }

    async getPosts() {

    }

    async deletePost() {

    }
}
