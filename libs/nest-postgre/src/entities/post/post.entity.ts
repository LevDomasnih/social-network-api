import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseCustomEntity, FilesEntity, UserEntity } from '@app/nest-postgre/entities';

@Entity('posts')
export class PostEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity })
    @ManyToOne(() => UserEntity, user => user.blogs)
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @ApiProperty({ type: () => FilesEntity })
    @ManyToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'images_id' })
    images: FilesEntity;

    @ApiProperty({ type: () => FilesEntity })
    @ManyToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'files_id' })
    files: FilesEntity;

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    likes: string[];

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    views: string[];

    @ApiProperty()
    @Column({ type: 'text' })
    text: string;

    // @ApiProperty({ type: () => [PostEntity] })
    @ManyToOne(() => PostEntity, post => post.childrenPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_posts_id' })
    parentPost: PostEntity;

    // @ApiProperty({ type: () => [BlogEntity] })
    @OneToMany(() => PostEntity, post => post.parentPost, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'children_posts' })
    childrenPosts: PostEntity[];
}
