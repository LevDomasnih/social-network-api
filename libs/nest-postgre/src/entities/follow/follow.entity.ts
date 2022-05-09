import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, SubscribersEntity } from '@app/nest-postgre/entities';

@Entity('follow')
export class FollowEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @OneToOne(() => UserEntity, user => user.follow)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty({ type: () => SubscribersEntity, default: ['userId'] })
    @OneToMany(() => SubscribersEntity, follow => follow.subscriber)
    subscriber: FollowEntity[];

    @ApiProperty({ type: () => SubscribersEntity, default: ['userId'] })
    @OneToMany(() => SubscribersEntity, follow => follow.subscriberOwner)
    @JoinColumn({name: 'subscriber_owner_id'})
    subscriberOwner: FollowEntity[];
}
