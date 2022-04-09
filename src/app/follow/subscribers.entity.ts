import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FollowEntity } from './follow.entity';

@Entity('subscribers')
export class SubscribersEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: string;

    @ApiProperty({ type: () => FollowEntity, default: ['userId'] })
    @ManyToOne(() => FollowEntity, follow => follow.subscriber)
    subscriber: FollowEntity;

    @ApiProperty({ type: () => FollowEntity, default: ['userId'] })
    @ManyToOne(() => FollowEntity, follow => follow.subscriberOwner)
    subscriberOwner: FollowEntity;
}
