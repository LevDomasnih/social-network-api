import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostsModel } from './posts.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { Express } from 'express';
import { UserModel } from '../users/user.model';
import { unlink } from 'fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
        @InjectModel(PostsModel) private readonly postsModel: ModelType<PostsModel>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
    ) {
    }

    async createPost(user: UserEntity, file: Express.Multer.File, dto: CreatePostRequestDto) {
        try {
            const newPost = await this.postRepository.save({
                image: file?.filename || '',
                owner: await this.userRepository.findOne(user.id),
                ...dto
            })

            return newPost;

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async createComment(
        user: UserEntity, parentId: string,
        file: Express.Multer.File, dto: CreatePostRequestDto
    ) {
      try {
          const parentPost = await this.postRepository.findOne({ id: parentId })

          if (!parentPost) {
              throw new BadRequestException('Пост не существует');
          }

          const newPost = await this.postRepository.save({
              image: file.filename || '',
              owner: await this.userRepository.findOne(user.id),
              ...dto,
              parentPosts: parentPost
          })

          if (!newPost) { throw new BadRequestException('Пост не был создан')}

          return newPost

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
