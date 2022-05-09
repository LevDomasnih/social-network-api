import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseCustomEntity, FollowEntity } from '@app/nest-postgre/entities';

@Entity('subscribers')
export class SubscribersEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => FollowEntity, default: ['userId'] })
    @ManyToOne(() => FollowEntity, follow => follow.subscriber)
    @JoinColumn({name: 'subscriber_id'})
    subscriber: FollowEntity;

    @ApiProperty({ type: () => FollowEntity, default: ['userId'] })
    @ManyToOne(() => FollowEntity, follow => follow.subscriberOwner)
    @JoinColumn({name: 'subscriber_owner'})
    subscriberOwner: FollowEntity;
}
