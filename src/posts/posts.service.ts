import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostDto } from './dto/create-post.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { unlink } from 'fs/promises';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
        private readonly jwtService: JwtService,
    ) {
    }

    async createPost(authorization: string, file: Express.Multer.File, dto: CreatePostDto) {
        try {
            const decodeData = await this.jwtService.verifyAsync(authorization.split(' ')[1]);

            const user = await this.userModel.findOne({email: decodeData.email}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует');
            }

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
        authorization: string, parentId: Types.ObjectId,
        file: Express.Multer.File, dto: CreatePostDto
    ) {
      try {
          const decodeData = await this.jwtService.verifyAsync(authorization.split(' ')[1]);

          const user = await this.userModel.findOne({email: decodeData.email}).exec()

          if (!user) {
              throw new BadRequestException('Данного пользователя не существует');
          }

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
              });

      } catch (e) {
          throw new BadRequestException(e)
      }
    }

    async updatePost(
        authorization: string, id: Types.ObjectId,
        file: Express.Multer.File, {text}: CreatePostDto
    ) {
        try {
            const decodeData = await this.jwtService.verifyAsync(authorization.split(' ')[1]);

            const user = await this.userModel.findOne({email: decodeData.email, posts: {$in: [id]}}).exec()

            if (!user) {
                throw new BadRequestException('Данного пользователя не существует или пользователь не владелец поста');
            }

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

    async getPostsOfUser(id: Types.ObjectId) {
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

    async test() {
        const nestId = '6182e2af813926336a926665';
        const _id = '6182e35bf30c4d25f49ffcef';

        const nestPost = await this.postsModel.findById(nestId);

        if (!nestPost) {
            throw new BadRequestException('Данного пользователя не существует');
        }

        return this.postsModel.findOneAndUpdate(
            { _id },
            { $push: { comments: nestPost._id } },
            { new: true },
        );
    }
}
