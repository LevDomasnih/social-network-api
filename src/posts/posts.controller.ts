import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    async createPost(@UploadedFile() file: Express.Multer.File, @Body() dto: CreatePostDto) {
        return this.postsService.createPost(file, dto)
    }

    @Post(':parentId')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    async createComment(
        @Param('parentId') parentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostDto
    ) {
        return this.postsService.createComment(parentId, file, dto)
    }

    @Get(':image')
    async getPost(@Param('image') image: string, @Res() res: Response) {
        res.sendFile(image, { root: './files'})
    }

    @Get('user/:id')
    async getPostsOfUser(@Param('id') id: Types.ObjectId) {
        return this.postsService.getPostsOfUser(id)
    }

    @Get()
    async test() {
        return this.postsService.test()
    }
}
