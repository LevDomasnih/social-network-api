import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Headers,
    Res,
    UploadedFile,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    async createPost(
        @Headers('authorization') authorization: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostDto
    ) {
        return this.postsService.createPost(authorization, file, dto)
    }

    @Post(':parentId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    async createComment(
        @Headers('authorization') authorization: string,
        @Param('parentId') parentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostDto
    ) {
        return this.postsService.createComment(authorization, parentId, file, dto)
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
