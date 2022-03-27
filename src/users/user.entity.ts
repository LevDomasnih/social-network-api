import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from '../profile/profile.entity';
import { FollowEntity } from '../follow/follow.entity';
import { PostEntity } from '../posts/post.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';

@Entity('users')
export class UserEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column({ name: 'password_hash' })
    passwordHash: string;

    @ApiProperty()
    @Column({ unique: true })
    login: string;

    @ApiProperty({ type: () => ProfileEntity, default: 'ProfileId' })
    @OneToOne(() => ProfileEntity, profile => profile.owner, { onDelete: 'CASCADE' })
    profile: ProfileEntity;

    @ApiProperty({ type: () => FollowEntity, default: 'followId' })
    @OneToOne(() => FollowEntity, follow => follow.owner, { onDelete: 'CASCADE' })
    follow: FollowEntity;

    @ApiProperty({ type: () => [PostEntity], default: ['postId'] })
    @OneToMany(() => PostEntity, post => post.owner, { onDelete: 'CASCADE' })
    posts: PostEntity[];

    @ApiProperty({ type: () => [DialogsEntity], default: ['dialogId'] })
    @OneToMany(() => DialogsEntity, dialogs => dialogs, { onDelete: 'CASCADE' })
    dialogs: DialogsEntity[];
}
