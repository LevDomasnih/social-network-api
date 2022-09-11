import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import {
    BlogEntity,
    BlogRepository, DialogsEntity, DialogsRepository, PostEntity, PostRepository,
    ProfileEntity,
    ProfileRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { IdValidationPipe } from '@app/common';
import { GetFollowScheme } from './schemes/get-follow.scheme';
import { GetUserBaseInfo } from './schemes/get-user-base-info';

@Resolver(() => UserEntity)
export class UsersResolver {

    constructor(
        private readonly userService: UsersService,
        private readonly usersRepository: UsersRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly blogRepository: BlogRepository,
        private readonly postRepository: PostRepository,
    ) {
    }

    @Query(returns => [UserEntity], { name: 'users' })
    async getUsers() {
        return this.usersRepository.getUsers();
    }

    @Query(returns => UserEntity, { name: 'userMe' })
    @UseGuards(JwtGqlGuard)
    async getMe(
        @UserGql() user: UserEntity,
    ) {
        return this.usersRepository.getUserById(user.id);
    }

    @Query(returns => GetUserBaseInfo, { name: 'userMeBaseInfo' })
    @UseGuards(JwtGqlGuard)
    async getMeBaseInfo(
        @UserGql() user: UserEntity,
    ) {
        return this.usersRepository.getUserBaseInfoById(user.id);
    }

    @Query(returns => UserEntity, { name: 'user' })
    @UseGuards(JwtGqlGuard)
    async getUserById(
        @Args('id', { type: () => ID }, IdValidationPipe) id: string,
    ) {
        return this.usersRepository.getUserById(id);
    }

    @ResolveField(returns => [BlogEntity], { name: 'blogs' })
    async getUserBlogs(
        @Parent() user: UserEntity,
    ) {
        return this.blogRepository.getBlogsByUser(user.id);
    }

    @ResolveField(returns => ProfileEntity, { name: 'profile' })
    async getUserProfile(
        @Parent() user: UserEntity,
    ) {
        return this.profileRepository.getProfileByUserId(user.id);
    }

    @ResolveField(returns => [PostEntity], { name: 'posts' })
    async getUserPosts(
        @Parent() user: UserEntity,
    ) {
        return this.postRepository.getPostsByUser(user.id);
    }

    @ResolveField(returns => [DialogsEntity], { name: 'dialogs' })
    async getUserDialogs(
        @Parent() user: UserEntity,
    ) {
        return this.usersRepository.getUserDialogsById(user.id);
    }

    @Query(returns => [GetFollowScheme])
    @UseGuards(JwtGqlGuard)
    async getFollowUsers(
        @Args('id', { type: () => String }, IdValidationPipe) id: string,
    ) {
        return this.userService.getFollowUsers(id);
    }
}
