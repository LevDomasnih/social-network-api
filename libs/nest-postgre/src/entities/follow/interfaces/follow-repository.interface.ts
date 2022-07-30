import { SubscribersEntity } from '@app/nest-postgre/entities';

export interface FollowRepositoryInterface {
    userIsFollow(subscriberId: string, subscriberOwnerId: string): Promise<boolean>
    userFollow(subscriberId: string, subscriberOwnerId: string): Promise<SubscribersEntity | undefined>
}
