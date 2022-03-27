import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';

@Entity('follow')
export class FollowEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @OneToOne(() => UserEntity, user => user.follow)
    @JoinColumn()
    owner: UserEntity;

    @ApiProperty({ type: () => UserEntity, default: ['userId'] })
    @OneToMany(() => UserEntity, user => user.id)
    followUser: UserEntity[];
}
