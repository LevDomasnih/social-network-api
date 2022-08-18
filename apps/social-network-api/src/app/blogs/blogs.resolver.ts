import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IdValidationPipe } from '@app/common';
import { BlogsService } from './blogs.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { CreateBlogScheme } from './schemes';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';
import { BlogsOfUserScheme } from './schemes/blogs-of-user.scheme';
import { CreateBlogDto } from './dto';
import { DeleteBlogScheme } from './schemes/delete-blog.scheme';


@Resolver()
export class BlogsResolver {
    constructor(
        private readonly blogsService: BlogsService,
    ) {
    }

    @Query(returns => [BlogsOfUserScheme], { name: 'blogsOfUser' })
    async getBlogsOfUser(
        @Args('id', { type: () => String }, IdValidationPipe) userId: string,
    ) {
        return this.blogsService.getBlogsOfUser(userId);
    }

    @Mutation(returns => [CreateBlogScheme])
    @UseGuards(JwtGqlGuard)
    async createBlog(
        @UserGql() user: UserEntity,
        @Args({ name: 'files', type: () => [GraphQLUpload] }) fileUpload: Promise<FileUpload>[],
        @Args('blogData') createBlogDto: CreateBlogDto,
    ): Promise<CreateBlogScheme[]> {
        const filesAwaited = await Promise.all(fileUpload);
        try {
            const files = await gqlFileUploadConvert(filesAwaited);
            return this.blogsService.createBlog(user, files, createBlogDto);
        } catch (err) {
            // @ts-ignore
            throw new Error(err);
        }
    }

    @Mutation(returns => DeleteBlogScheme)
    @UseGuards(JwtGqlGuard)
    async deleteBlog(
        @UserGql() user: UserEntity,
        @Args('id', { type: () => String }, IdValidationPipe) postId: string,
    ): Promise<DeleteBlogScheme> {
        return this.blogsService.deleteBlog(user, postId);
    }
}
