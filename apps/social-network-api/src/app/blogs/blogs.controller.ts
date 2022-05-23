import {
    applyDecorators,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { CreateBlogRequestDto, FileUploadDto, GetBlogsOfUserResponseDto } from './dto';
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

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
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
        description: 'Create blog',
        // type: CreatePostResponseDto,
    })
    async createBlog(
        @User() user: UserEntity,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreateBlogRequestDto,
    )/*: Promise<CreatePostResponseDto>*/ {
        return this.blogsService.createBlog(user, files, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @SwaggerApi({
        description: 'Delete blog',
    })
    async deleteBlog(
        @User() user: UserEntity,
        @Param('id', IdValidationPipe) postId: string,
    ) {
        return this.blogsService.deleteBlog(user, postId);
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
    //     type: UpdateBlogResponseDto,
    // })
    // async updatePost(
    //     @User() user: UserEntity,
    //     @Param('id', IdValidationPipe) postId: string,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() dto: UpdateBlogRequestDto,
    // ): Promise<UpdateBlogResponseDto> {
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
        description: 'Get user blogs by id',
        type: [GetBlogsOfUserResponseDto],
    })
    async getBlogsOfUser(
        @Param('id', IdValidationPipe) userId: string,
    ): Promise<GetBlogsOfUserResponseDto[]> {
        return this.blogsService.getBlogsOfUser(userId);
    }
}
