import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from '../profile/profile.entity';
import { FollowEntity } from '../follow/follow.entity';
import { PostEntity } from '../posts/post.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';
import { MessagesEntity } from '../messages/messages.entity';

@Entity('users')
export class UserEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    email: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @ApiProperty()
    @Column({ unique: true })
    login: string;

    // @ApiProperty({ type: () => ProfileEntity, default: 'ProfileId' })
    @OneToOne(() => ProfileEntity, profile => profile.owner, { onDelete: 'CASCADE' })
    profile: ProfileEntity;

    // @ApiProperty({ type: () => FollowEntity, default: 'followId' })
    @OneToOne(() => FollowEntity, follow => follow.owner, { onDelete: 'CASCADE' })
    follow: FollowEntity;

    // @ApiProperty({ type: () => [PostEntity], default: ['postId'] })
    @OneToMany(() => PostEntity, post => post.owner, { onDelete: 'CASCADE' })
    posts: PostEntity[];

    // @ApiProperty({ type: () => [DialogsEntity], default: ['dialogId'] })
    @ManyToMany(() => DialogsEntity, dialogs => dialogs.owners, { onDelete: 'CASCADE' })
    dialogs: DialogsEntity[];

    // @ApiProperty({ type: () => [MessagesEntity] })
    @OneToMany(() => MessagesEntity, message => message.owner)
    messages: MessagesEntity[];
}
