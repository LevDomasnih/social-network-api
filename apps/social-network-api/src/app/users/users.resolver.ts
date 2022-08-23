import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { BlogEntity, ProfileEntity, UserEntity } from '@app/nest-postgre';
import { IdValidationPipe } from '@app/common';
import { GetFollowScheme } from './schemes/get-follow.scheme';
import { BlogsService } from '../blogs/blogs.service';
import { ModuleRef } from '@nestjs/core';
import { ProfileService } from '../profile/profile.service';

@Resolver(() => UserEntity)
export class UsersResolver implements OnModuleInit {
    private blogsService: BlogsService;
    private profileService: ProfileService;

    constructor(
        private readonly userService: UsersService,
        private readonly moduleRef: ModuleRef,
    ) {
    }

    onModuleInit() {
        this.blogsService = this.moduleRef.get(BlogsService, { strict: false });
        this.profileService = this.moduleRef.get(ProfileService, { strict: false });
    }

    @Query(returns => [UserEntity], { name: 'users' })
    async getUsers() {
        return this.userService.getUsers();
    }

    @Query(returns => UserEntity, { name: 'userMe' })
    @UseGuards(JwtGqlGuard)
    async getMe(
        @UserGql() user: UserEntity,
    ) {
        return this.userService.getUserById(user.id);
    }

    @Query(returns => UserEntity, { name: 'user' })
    @UseGuards(JwtGqlGuard)
    async getUserById(
        @Args('id', { type: () => String }, IdValidationPipe) id: string,
    ) {
        return this.userService.getUserById(id);
    }

    @ResolveField(returns => [BlogEntity], { name: 'blogs' })
    async getUserBlogs(
        @Parent() user: UserEntity,
    ) {
        return this.blogsService.getBlogsOfUser(user.id);
    }

    @ResolveField(returns => ProfileEntity, { name: 'profile' })
    async getUserProfile(
        @Parent() user: UserEntity,
    ) {
        return this.profileService.findProfile(user.id);
    }

    @Query(returns => [GetFollowScheme])
    @UseGuards(JwtGqlGuard)
    async getFollowUsers(
        @Args('id', { type: () => String }, IdValidationPipe) id: string,
    ) {
        return this.userService.getFollowUsers(id);
    }
}
