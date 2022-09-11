import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, SubscribersEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('follow')
export class FollowEntity extends BaseCustomEntity {
    @Field(type => UserEntity)
    @OneToOne(() => UserEntity, user => user.follow)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @Field(type => [FollowEntity])
    @OneToMany(() => SubscribersEntity, follow => follow.subscriber)
    subscriber: FollowEntity[];

    @Field(type => [FollowEntity])
    @OneToMany(() => SubscribersEntity, follow => follow.subscriberOwner)
    @JoinColumn({name: 'subscriber_owner_id'})
    subscriberOwner: FollowEntity[];
}
