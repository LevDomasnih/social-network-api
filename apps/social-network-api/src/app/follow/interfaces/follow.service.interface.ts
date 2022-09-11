import { FollowInterface } from './follow.interface';
import { UnfollowInterface } from './unfollow.interface';

export interface FollowServiceInterface {
    follow(subscriberId: string, ownerId: string): Promise<FollowInterface>
    unfollow(subscriberId: string, ownerId: string): Promise<UnfollowInterface>
}
