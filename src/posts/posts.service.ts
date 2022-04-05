import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly postRepository: PostsRepository,
    ) {
    }

    async createPost(user: UserEntity, file: Express.Multer.File, dto: CreatePostRequestDto) {
        try {
            return this.postRepository.save({
                image: file?.filename || '',
                owner: await this.userRepository.findOne(user.id),
                ...dto,
            });
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async createComment(
        user: UserEntity, parentId: string,
        file: Express.Multer.File, dto: CreatePostRequestDto,
    ) {
        try {
            const parentPost = await this.postRepository.findOne({ id: parentId });

            if (!parentPost) {
                throw new BadRequestException('Пост не существует');
            }

            const newPost = await this.postRepository.save({
                image: file.filename || '',
                owner: await this.userRepository.findOne(user.id),
                ...dto,
                parentPosts: parentPost,
            });

            if (!newPost) {
                throw new BadRequestException('Пост не был создан');
            }

            return newPost;

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async updatePost(
        user: UserEntity, postId: string,
        file: Express.Multer.File, { text }: CreatePostRequestDto,
    ) {
        try {
            const oldPost = await this.postRepository.findOne({ id: postId });

            const oldImageName = oldPost?.image;

            if (oldImageName) {
                await unlink(`files/${oldImageName}`);
            }

            const updatedPost = await this.postRepository.update(
                { id: postId },
                {
                    text,
                    image: file.filename,
                },
            );

            if (!updatedPost.affected) {
                throw new BadRequestException('Пост не был обновлен');
            }

            return updatedPost; // TODO

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getPost() {

    }

    async getPostsOfUser(userId: string) {
        const posts = await this.postRepository.getPostAndCommentsByUserId(userId)

        if (!posts) {
            throw new BadRequestException('Постов нет');
        }

        return posts;
    }

    async getPosts() {

    }

    async deletePost() {

    }
}
