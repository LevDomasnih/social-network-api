import {
    applyDecorators,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../../common/pipes/id-validation.pipe';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { GetPostsOfUserResponseDto } from './dto/get-posts-of-user/get-posts-of-user.response.dto';
import { UpdatePostRequestDto } from './dto/update-post/update-post.request.dto';
import { CreatePostRequestDto } from './dto/create-post/create-post.request.dto';
import { UpdatePostResponseDto } from './dto/update-post/update-post.response.dto';
import { CreatePostResponseDto } from './dto/create-post/create-post.response.dto';
import { CreateCommentRequestDto } from './dto/create-comment/create-comment.request.dto';
import { CreateCommentResponseDto } from './dto/create-comment/create-comment.response.dto';

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
        type: CreatePostResponseDto,
    })
    async createPost(
        @User() user: UserEntity,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostRequestDto,
    ): Promise<CreatePostResponseDto> {
        return this.postsService.createPost(user, file, dto);
    }

    @Post(':parentId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './files' }),
    }))
    @SwaggerApi({
        description: 'Create comment',
        type: CreateCommentResponseDto,
    })
    async createComment(
        @User() user: UserEntity,
        @Param('parentId', IdValidationPipe) parentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateCommentRequestDto,
    ): Promise<CreateCommentResponseDto> {
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
        @Param('id', IdValidationPipe) postId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdatePostRequestDto,
    ): Promise<UpdatePostResponseDto> {
        return this.postsService.updatePost(user, postId, file, dto);
    }

    // TODO вернуть
    // @Get(':image')
    // @ApiCreatedResponse({
    //     description: 'Get photo',
    //     type: 'file',
    // })
    // async getPost(@Param('imageId') imageId: string, @Res() res: Response) {
    //     res.sendFile(imageId, { root: './files' });
    // }

    @Get('user/:id')
    @ApiCreatedResponse({
        description: 'Get user posts by id',
        type: [GetPostsOfUserResponseDto],
    })
    async getPostsOfUser(
        @Param('id', IdValidationPipe) userId: string,
    ): Promise<GetPostsOfUserResponseDto[]> {
        return this.postsService.getPostsOfUser(userId);
    }
}
