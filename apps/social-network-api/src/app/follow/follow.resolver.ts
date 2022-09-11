import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { IdValidationPipe } from '@app/common';
import { UnfollowScheme } from './schemes/unfollow.scheme';
import { FollowScheme } from './schemes/follow.scheme';

@Resolver()
export class FollowResolver {
    constructor(private readonly followService: FollowService) {
    }

    @Mutation(returns => FollowScheme)
    @UseGuards(JwtGqlGuard)
    async follow(
        @UserGql() user: UserEntity,
        @Args('userId', {type: () => String}, IdValidationPipe) subscriberId: string
    ) {
        return this.followService.follow(user.id, subscriberId);
    }

    @Mutation(returns => UnfollowScheme)
    @UseGuards(JwtGqlGuard)
    async unfollow(
        @UserGql() user: UserEntity,
        @Args('userId', {type: () => String}, IdValidationPipe) subscriberId: string
    ) {
        return this.followService.unfollow(user.id, subscriberId);
    }
}
