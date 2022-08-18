import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { IdValidationPipe } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CreatePostInput } from './dto/create-post.input';
import { GetPostScheme } from './schemes/get-post.scheme';
import { GetPostsScheme } from './schemes/get-posts.scheme';
import { CreatePostScheme } from './schemes/create-post.scheme';
import { ChangeLikeScheme } from './schemes/change-like.scheme';

@Resolver()
export class PostsResolver {
    constructor(
        private readonly postsService: PostsService
    ) {
    }

    @Query(returns => GetPostScheme)
    async getPost(
        @Args('postId', IdValidationPipe) postId: string,
    ): Promise<GetPostScheme | undefined> {
        return this.postsService.getPost(postId)
    }

    @Query(returns => [GetPostsScheme])
    async getPosts(
        @Args('userId', IdValidationPipe) userId: string,
    ): Promise<GetPostsScheme[]> {
        return this.postsService.getPosts(userId);
    }

    @Mutation(returns => CreatePostScheme)
    @UseGuards(JwtGqlGuard)
    async createPost(
        @UserGql() user: UserEntity,
        @Args({ name: 'files', type: () => [GraphQLUpload] }) fileUpload: Promise<FileUpload>[],
        @Args('data') createPostInput: CreatePostInput
    ) {
        return this.postsService.createPost(user, createPostInput)
    }

    @Mutation(returns => ChangeLikeScheme)
    @UseGuards(JwtAuthGuard)
    async changeLike(
        @UserGql() user: UserEntity,
        @Args('postId', IdValidationPipe) postId: string,
    ) {
        return this.postsService.changeLike(user, postId)
    }
}
