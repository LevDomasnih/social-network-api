import {
    applyDecorators,
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
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { UpdatePostRequestDto } from './dto/update-post-request.dto';
import { UpdatePostResponseDto } from './dto/update-post-response.dto';
import { GetUserPostsResponseDto } from './dto/get-user-posts-response.dto';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { PostWithCommentsDto } from './dto/post-with-comments.dto';

function SwaggerApi(createdResponse: ApiResponseOptions) {
    return applyDecorators(
        ApiBearerAuth(),
        ApiConsumes('multipart/form-data'),
        ApiBody({ type: FileUploadDto }),
        ApiCreatedResponse(createdResponse),
    );
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' }),
    }))
    @SwaggerApi({
        description: 'Create Post',
    })
    async createPost(
        @User() user: UserEntity,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostRequestDto,
    ) {
        return this.postsService.createPost(user, file, dto);
    }

    @Post(':parentId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' }),
    }))
    @SwaggerApi({
        description: 'Create comment',
    })
    async createComment(
        @User() user: UserEntity,
        @Param('parentId', IdValidationPipe) parentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateCommentRequestDto,
    ) {
        return this.postsService.createComment(user, parentId, file, dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' }),
    }))
    @SwaggerApi({
        description: 'Update post',
        type: UpdatePostResponseDto,
    })
    async updatePost(
        @User() user: UserEntity,
        @Headers('authorization') authorization: string,
        @Param('id', IdValidationPipe) postId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdatePostRequestDto,
    ) {
        return this.postsService.updatePost(user, postId, file, dto);
    }

    @Get(':image')
    @ApiCreatedResponse({
        description: 'Get photo',
        type: 'file',
    })
    async getPost(@Param('imageId') imageId: string, @Res() res: Response) {
        res.sendFile(imageId, { root: './files' });
    }

    @Get('user/:id')
    @ApiCreatedResponse({
        description: 'Get user posts',
        type: [PostWithCommentsDto],
    })
    async getPostsOfUser(
        @Param('id', IdValidationPipe) userId: string,
    ): Promise<PostWithCommentsDto> {
        return this.postsService.getPostsOfUser(userId);
    }
}
