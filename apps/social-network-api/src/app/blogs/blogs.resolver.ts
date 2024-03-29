import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IdValidationPipe } from '@app/common';
import { BlogsService } from './blogs.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import {
    BlogEntity,
    BlogRepository,
    BlogTextBlockEntity,
    BlogTextBlockRepository, FilesEntity, FilesRepository, ProfileEntity,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { CreateBlogScheme } from './schemes';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';
import { CreateBlogDto } from './dto';
import { DeleteBlogScheme } from './schemes/delete-blog.scheme';


@Resolver(() => BlogEntity)
export class BlogsResolver {

    constructor(
        private readonly blogsService: BlogsService,
        private readonly blogRepository: BlogRepository,
        private readonly usersRepository: UsersRepository,
        private readonly blogTextBlockRepository: BlogTextBlockRepository,
        private readonly filesRepository: FilesRepository,
    ) {
    }

    @Query(returns => [BlogEntity], { name: 'blogsOfUser' })
    async getBlogsOfUser(
        @Args('id', { type: () => ID }, IdValidationPipe) userId: string,
    ) {
        return this.blogRepository.getBlogsByUser(userId);
    }

    @Query(returns => [BlogEntity], { name: 'blogsMe' })
    @UseGuards(JwtGqlGuard)
    async getBlogsOfMe(
        @UserGql() user: UserEntity
    ) {
        return this.blogRepository.getBlogsByUser(user.id);
    }

    @ResolveField(returns => UserEntity, { name: 'owner' })
    async getUserBlogs(
        @Parent() blog: BlogEntity,
    ) {
        return this.usersRepository.getUserById(blog.owner.id);
    }

    @ResolveField(returns => [BlogTextBlockEntity], { name: 'textBlocks' })
    async getBlogTextBlocksOfBlog(
        @Parent() blog: BlogEntity,
    ) {
        return this.blogTextBlockRepository.getBlogTextBlocksByBlog(blog.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'mainImage', nullable: true  })
    async getMainImage(
        @Parent() blog: BlogEntity,
    ) {
        return this.filesRepository.getFile(blog.mainImage.id);
    }

    @Mutation(returns => BlogEntity)
    @UseGuards(JwtGqlGuard)
    async createBlog(
        @UserGql() user: UserEntity,
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true }) filesUpload: FileUpload[],
        @Args('blogData') createBlogDto: CreateBlogDto,
    ): Promise<BlogEntity> {
        const filesAwaited = await Promise.all(filesUpload);
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
