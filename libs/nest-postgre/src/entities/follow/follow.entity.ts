import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { SubscribersEntity } from '@app/nest-postgre/entities';

@Entity('follow')
export class FollowEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @OneToOne(() => UserEntity, user => user.follow)
    @JoinColumn()
    owner: UserEntity;

    @ApiProperty({ type: () => SubscribersEntity, default: ['userId'] })
    @OneToMany(() => SubscribersEntity, follow => follow.subscriber)
    subscriber: FollowEntity[];

    @ApiProperty({ type: () => SubscribersEntity, default: ['userId'] })
    @OneToMany(() => SubscribersEntity, follow => follow.subscriberOwner)
    subscriberOwner: FollowEntity[];
}
