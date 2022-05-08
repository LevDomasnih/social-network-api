import { BadRequestException, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { PostsRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import {
    CreateCommentRequestDto,
    CreateCommentResponseDto,
    CreatePostRequestDto,
    CreatePostResponseDto,
    GetPostsOfUserResponseDto,
    UpdatePostResponseDto,
} from './dto';

@Injectable()
export class PostsService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly postRepository: PostsRepository,
    ) {
    }

    async createPost(
        user: UserEntity,
        file: Express.Multer.File,
        dto: CreatePostRequestDto,
    ): Promise<CreatePostResponseDto> {
        try {
            return this.postRepository.save({
                image: file?.filename || '',
                owner: await this.usersRepository.findOne(user.id),
                ...dto,
            });
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async createComment(
        user: UserEntity, parentId: string,
        file: Express.Multer.File, dto: CreateCommentRequestDto,
    ): Promise<CreateCommentResponseDto> {
        const parentPost = await this.postRepository.findOne({ id: parentId });
        if (!parentPost) {
            throw new BadRequestException('Пост не существует');
        }
        return this.postRepository.saveAndGet({
            image: file?.filename || '',
            owner: await this.usersRepository.findOne(user.id),
            ...dto,
            parentPosts: parentPost,
        }, {}, { relations: ['owner'] });
    }

    async updatePost(
        user: UserEntity, postId: string,
        file: Express.Multer.File, { text }: CreatePostRequestDto,
    ): Promise<UpdatePostResponseDto> {
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
        return {
            updated: updatedPost.affected === 1,
        }; // TODO
    }

    async getPost() {

    }

    async getPostsOfUser(userId: string): Promise<GetPostsOfUserResponseDto[]> {
        return this.postRepository.getPostsAndCommentsByUserId(userId);
    }

    async getPosts() {

    }

    async deletePost() {

    }
}
