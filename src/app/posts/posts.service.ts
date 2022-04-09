import { BadRequestException, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { unlink } from 'fs/promises';
import { UserEntity } from '../users/user.entity';
import { PostsRepository } from './posts.repository';
import { UsersRepository } from '../users/users.repository';
import { GetPostsOfUserResponseDto } from './dto/get-posts-of-user/get-posts-of-user.response.dto';
import { UpdatePostResponseDto } from './dto/update-post/update-post.response.dto';
import { CreatePostResponseDto } from './dto/create-post/create-post.response.dto';
import { CreatePostRequestDto } from './dto/create-post/create-post.request.dto';
import { CreateCommentRequestDto } from './dto/create-comment/create-comment.request.dto';
import { CreateCommentResponseDto } from './dto/create-comment/create-comment.response.dto';

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
        }, {}, {relations: ['owner']});
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
