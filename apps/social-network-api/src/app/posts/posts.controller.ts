import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { IdValidationPipe, User } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UserEntity } from '@app/nest-postgre';
import { CreatePostDto } from './dto/create-post/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {
    }

    @Get(':postId')
    async getPost(
        @Param('postId', IdValidationPipe) postId: string
    ) {
        return this.postsService.getPost(postId)
    }

    @Get(':userId')
    async getPosts(
        @Param('userId', IdValidationPipe) userId: string
    ) {

    }

    @Post() // TODO добавить фотки и файлы
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Create post',
    })
    async createPost(
        @User() user: UserEntity,
        @Body() dto: CreatePostDto
    ) {
        return this.postsService.createPost(user, dto)
    }

    @Put(':postId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Edit post',
    })
    async editPost(
        @Param('postId', IdValidationPipe) postId: string
    ) {

    }

    @Delete(':postId')
    @UseGuards(JwtAuthGuard)
    @ApiCreatedResponse({
        description: 'Delete post',
    })
    async deletePost(
        @Param('postId', IdValidationPipe) postId: string
    ) {

    }
}
