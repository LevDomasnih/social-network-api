import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',

        }),
    }),)
    // tslint:disable-next-line:no-any
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        console.log(file);
        console.log(body.a);
    }

    @Post()
    async createPost() {

    }

    @Get()
    async getPost() {

    }
}
