import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { FollowEntity } from '../follow/follow.entity';
import { BlogEntity } from '../blog/blog.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';
import { BaseCustomEntity, MessagesEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class UserEntity extends BaseCustomEntity {
    @Field(type => String)
    @Column()
    email: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Field(type => String)
    @Column({ unique: true })
    login: string;

    @Field(type => ProfileEntity)
    @OneToOne(() => ProfileEntity, profile => profile.owner, { onDelete: 'CASCADE' })
    profile: ProfileEntity;

    @Field(type => FollowEntity)
    @OneToOne(() => FollowEntity, follow => follow.owner, { onDelete: 'CASCADE' })
    follow: FollowEntity;

    @Field(type => [BlogEntity])
    @OneToMany(() => BlogEntity, blog => blog.owner, { onDelete: 'CASCADE' })
    blogs: BlogEntity[];

    @Field(type => [DialogsEntity])
    @ManyToMany(() => DialogsEntity, dialogs => dialogs.owners, { onDelete: 'CASCADE' })
    dialogs: DialogsEntity[];

    @Field(type => [MessagesEntity])
    @OneToMany(() => MessagesEntity, message => message.owner)
    messages: MessagesEntity[];
}
