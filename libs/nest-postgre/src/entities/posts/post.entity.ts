import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity, PostTextBlocksEntity } from '@app/nest-postgre/entities';

@Entity('posts')
export class PostEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity })
    @ManyToOne(() => UserEntity, user => user.posts)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty()
    @OneToMany(() => PostTextBlocksEntity, postText => postText.postOwner, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'text_blocks'})
    textBlocks: string;

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    headers: string[];

    @ApiProperty()
    @Column({
        type: 'jsonb',
        name: 'entity_map',
        default: () => "'{}'",
        nullable: false,
    })
    entityMap: {}

    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'main_image_id'})
    mainImage: FilesEntity; // TODO file

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
    @OneToMany(() => PostEntity, post => post.parentPosts, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'children_posts'})
    childrenPosts: PostEntity[];
}
