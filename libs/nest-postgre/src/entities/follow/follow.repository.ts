import { FollowEntity } from './follow.entity';
import { createQueryBuilder, EntityRepository } from 'typeorm';
import { BaseRepository, FollowRepositoryInterface, SubscribersEntity } from '@app/nest-postgre/entities';

@EntityRepository(FollowEntity)
export class FollowRepository extends BaseRepository<FollowEntity> implements FollowRepositoryInterface {
    async userIsFollow(subscriberId: string, subscriberOwnerId: string): Promise<boolean> {
        const userFollow = await this.createQueryBuilder()
            .select('s.id', 'id')
            .from(FollowEntity, 'follow')
            .where('follow.id = :followId', { followId: subscriberId })
            .innerJoinAndSelect('follow.subscriber', 's')
            .andWhere('s.subscriberOwnerId = :ownerId', { ownerId: subscriberOwnerId })
            .getRawOne();
        return !!userFollow
    }

    async userFollow(subscriberId: string, subscriberOwnerId: string): Promise<SubscribersEntity | undefined> {
        return createQueryBuilder()
            .select('s.id', 'id')
            .from(FollowEntity, 'follow')
            .where('follow.id = :followId', { followId: subscriberId })
            .innerJoinAndSelect('follow.subscriber', 's')
            .andWhere('s.subscriberOwnerId = :ownerId', { ownerId: subscriberOwnerId })
            .getRawOne();
    }
}
