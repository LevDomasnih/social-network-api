import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { CreatePostResponseDto } from './dto/create-post-response.dto';
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { CreateCommentResponseDto } from './dto/create-comment-response.dto';
import { UpdatePostRequestDto } from './dto/update-post-request.dto';
import { UpdatePostResponseDto } from './dto/update-post-response.dto';
import { GetUserPostsResponseDto } from './dto/get-user-posts-response.dto';
import { Ref } from '@typegoose/typegoose';

@ApiTags('posts')
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
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiCreatedResponse({
        description: 'Create Post',
        type: CreatePostResponseDto,
    })
    async createPost(
        @Headers('authorization') authorization: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostRequestDto
    ) : Promise<CreatePostResponseDto> {
        return this.postsService.createPost(authorization, file, dto)
    }

    @Post(':parentId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiCreatedResponse({
        description: 'Create comment',
        type: CreateCommentResponseDto,
    })
    async createComment(
        @Headers('authorization') authorization: string,
        @Param('parentId', IdValidationPipe) parentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateCommentRequestDto
    ): Promise<CreateCommentResponseDto> {
        return this.postsService.createComment(authorization, parentId, file, dto)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' })
    }))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiCreatedResponse({
        description: 'Update post',
        type: UpdatePostResponseDto,
    })
    async updatePost(
        @Headers('authorization') authorization: string,
        @Param('id', IdValidationPipe) id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdatePostRequestDto
    ): Promise<UpdatePostResponseDto> {
        return this.postsService.updatePost(authorization, id, file, dto)
    }

    @Get(':image')
    @ApiCreatedResponse({
        description: 'Get photo',
        type: 'file',
    })
    async getPost(@Param('imageId') imageId: string, @Res() res: Response) {
        res.sendFile(imageId, { root: './files'})
    }

    @Get('user/:id')
    @ApiCreatedResponse({
        description: 'Get user posts',
        type: [GetUserPostsResponseDto],
    })
    async getPostsOfUser(
        @Param('id', IdValidationPipe) id: string
    ): Promise<Ref<GetUserPostsResponseDto>[]> {
        return this.postsService.getPostsOfUser(id)
    }
}
