import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { IdValidationPipe, User } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UserEntity } from '@app/nest-postgre';
import { CreatePostDto } from './dto/create-post/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GetPostsDto } from './dto/get-posts/get-posts.dto';

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

    @Get('user/:userId')
    async getPosts(
        @Param('userId', IdValidationPipe) userId: string
    ): Promise<GetPostsDto[] | BadRequestException> {
        return this.postsService.getPosts(userId);
    }

    @Post() // TODO добавить фотки и файлы
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    @ApiCreatedResponse({
        description: 'Create post',
    })
    async createPost(
        @User() user: UserEntity,
        @UploadedFiles() files: Express.Multer.File[],
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
