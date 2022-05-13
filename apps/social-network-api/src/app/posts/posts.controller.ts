import {
    applyDecorators,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import {
    CreateCommentRequestDto,
    CreateCommentResponseDto,
    CreatePostRequestDto,
    CreatePostResponseDto,
    FileUploadDto,
    GetPostsOfUserResponseDto,
    UpdatePostRequestDto,
    UpdatePostResponseDto,
} from './dto';
import { IdValidationPipe, User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';

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

    // @Post('saveTempImage')
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FilesInterceptor('files'))
    // saveTempPostFiles(
    //     @User() user: UserEntity,
    //     @UploadedFiles() files: Express.Multer.File[],
    // ) {
    //     return this.postsService.saveTempPostFiles(user, files)
    // }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files')) // TODO РАСШИРИТЬ ДЛЯ ДРУГИХ ФОТО И ФАЙЛОВ
    @SwaggerApi({
        description: 'Create Post',
        // type: CreatePostResponseDto,
    })
    async createPost(
        @User() user: UserEntity,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreatePostRequestDto,
    )/*: Promise<CreatePostResponseDto>*/ {
        return this.postsService.createPost(user, files, dto);
    }

    // @Post(':parentId')
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({ destination: './files' }),
    // }))
    // @SwaggerApi({
    //     description: 'Create comment',
    //     type: CreateCommentResponseDto,
    // })
    // async createComment(
    //     @User() user: UserEntity,
    //     @Param('parentId', IdValidationPipe) parentId: string,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() dto: CreateCommentRequestDto,
    // ): Promise<CreateCommentResponseDto> {
    //     return this.postsService.createComment(user, parentId, file, dto);
    // }

    // @Put(':id')
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({ destination: './files' }),
    // }))
    // @SwaggerApi({
    //     description: 'Update post',
    //     type: UpdatePostResponseDto,
    // })
    // async updatePost(
    //     @User() user: UserEntity,
    //     @Param('id', IdValidationPipe) postId: string,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() dto: UpdatePostRequestDto,
    // ): Promise<UpdatePostResponseDto> {
    //     return this.postsService.updatePost(user, postId, file, dto);
    // }

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
