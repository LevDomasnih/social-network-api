import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { CreatePostDto } from './dto/create-post.dto';

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
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
        console.log(file);
        console.log(body);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',

        }),
    }),)
    async createPost(@UploadedFile() file: Express.Multer.File, @Body() dto: CreatePostDto) {
        return this.postsService.createPost(file, dto)
    }

    @Get(':image')
    async getPost(@Param('image') image: string, @Res() res: Response) {
        res.sendFile(image, { root: './files'})
    }
}
