import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { IdValidationPipe } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import {
    FilesEntity,
    FilesRepository,
    PostEntity,
    PostRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CreatePostInput } from './dto/create-post.input';
import { CreatePostScheme } from './schemes/create-post.scheme';
import { ChangeLikeScheme } from './schemes/change-like.scheme';

@Resolver(() => PostEntity)
export class PostsResolver {
    constructor(
        private readonly postsService: PostsService,
        private readonly postRepository: PostRepository,
        private readonly usersRepository: UsersRepository,
        private readonly filesRepository: FilesRepository,
    ) {
    }

    @Query(returns => PostEntity, {name: 'post'})
    async getPost(
        @Args('postId', {type: () => ID}, IdValidationPipe) postId: string,
    ): Promise<PostEntity | undefined> {
        return this.postRepository.getPostById(postId);
    }

    @Query(returns => [PostEntity], {name: 'posts'})
    async getPosts(
        @Args('userId', {type: () => ID}, IdValidationPipe) userId: string,
    ): Promise<PostEntity[]> {
        return this.postRepository.getPostsByUser(userId);
    }

    @ResolveField(returns => UserEntity, { name: 'owner' })
    async getUser(
        @Parent() post: PostEntity,
    ) {
        return this.usersRepository.getUserById(post.owner.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'images', nullable: true })
    async getImages(
        @Parent() post: PostEntity,
    ) {
        if (!post.images) {
            return null;
        }
        return this.filesRepository.getFile(post.images.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'files', nullable: true })
    async getFiles(
        @Parent() post: PostEntity,
    ) {
        if (!post.files) {
            return null;
        }
        return this.filesRepository.getFile(post.files.id);
    }

    @ResolveField(returns => PostEntity, { name: 'parentPost', nullable: true })
    async getParentPost(
        @Parent() post: PostEntity,
    ) {
        return this.postRepository.getParentPost(post.id);
    }

    @ResolveField(returns => [PostEntity], { name: 'childrenPosts' })
    async getChildrenPosts(
        @Parent() post: PostEntity,
    ) {
        return this.postRepository.getChildrenPosts(post.id);
    }

    @Mutation(returns => PostEntity)
    @UseGuards(JwtGqlGuard)
    async createPost(
        @UserGql() user: UserEntity,
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true }) fileUpload: Promise<FileUpload>[],
        @Args('data') createPostInput: CreatePostInput,
    ) {
        return this.postsService.createPost(user, createPostInput);
    }

    @Mutation(returns => ChangeLikeScheme)
    @UseGuards(JwtAuthGuard)
    async changeLike(
        @UserGql() user: UserEntity,
        @Args('postId', IdValidationPipe) postId: string,
    ) {
        return this.postsService.changeLike(user, postId);
    }
}
