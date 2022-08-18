import { FollowEntity } from '@app/nest-postgre';

export interface FollowInterface {
    id: string;
    updatedAt: Date;
    createdAt: Date;
    subscriber: FollowEntity;
    subscriberOwner: FollowEntity;
}
