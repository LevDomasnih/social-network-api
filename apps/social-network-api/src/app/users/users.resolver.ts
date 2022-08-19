import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { IdValidationPipe } from '@app/common';
import { GetUserScheme } from './schemes/get-user.scheme';
import { GetFollowScheme } from './schemes/get-follow.scheme';

@Resolver()
export class UsersResolver {
    constructor(
        private readonly userService: UsersService,
    ) {
    }

    @Query(returns => [GetUserScheme])
    async getUsers() {
        return this.userService.getUsers();
    }

    @Query(returns => GetUserScheme)
    @UseGuards(JwtGqlGuard)
    async getMe(
        @UserGql() user: UserEntity
    ) {
        return this.userService.getUserById(user.id);
    }

    @Query(returns => GetUserScheme)
    @UseGuards(JwtGqlGuard)
    async getUserById(
        @Args('id',{type: () => String} , IdValidationPipe) id: string
    ) {
        return this.userService.getUserById(id);
    }

    @Query(returns => [GetFollowScheme])
    @UseGuards(JwtGqlGuard)
    async getFollowUsers(
        @Args('id',{type: () => String} , IdValidationPipe) id: string
    ) {
        return this.userService.getFollowUsers(id);
    }
}
