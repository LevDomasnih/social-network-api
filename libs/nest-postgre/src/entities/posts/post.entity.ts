import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity } from '@app/nest-postgre/entities';

@Entity('posts')
export class PostEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity })
    @ManyToOne(() => UserEntity, user => user.posts)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty()
    @Column({ default: '' })
    text: string;

    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity)
    image: string; // TODO file

    @ApiProperty()
    @Column({ default: 0 })
    likes: number;

    @ApiProperty()
    @Column({ default: 0 })
    views: number;

    // @ApiProperty({ type: () => [PostEntity] })
    @ManyToOne(() => PostEntity, post => post.childrenPosts)
    @JoinColumn({name: 'parent_posts_id'})
    parentPosts: PostEntity;

    // @ApiProperty({ type: () => [PostEntity] })
    @OneToMany(() => PostEntity, post => post.parentPosts)
    @JoinColumn({name: 'children_posts'})
    childrenPosts: PostEntity[];
}
