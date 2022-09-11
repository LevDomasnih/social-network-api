import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseCustomEntity, FilesEntity, UserEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('posts')
export class PostEntity extends BaseCustomEntity {
    @Field(type => UserEntity)
    @ManyToOne(() => UserEntity, user => user.blogs)
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @Field(type => FilesEntity, { nullable: true })
    @ManyToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'images_id' })
    images: FilesEntity;

    @Field(type => FilesEntity, {nullable: true})
    @ManyToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'files_id' })
    files: FilesEntity;

    @Field(type => [String], { nullable: true })
    @Column({
        type: 'jsonb',
        array: false,
        default: () => '\'[]\'',
        nullable: false,
    })
    likes: string[];

    @Field(type => [String], { nullable: true })
    @Column({
        type: 'jsonb',
        array: false,
        default: () => '\'[]\'',
        nullable: false,
    })
    views: string[];

    @Field()
    @Column({ type: 'text' })
    text: string;

    @Field(tye => PostEntity, {nullable: true})
    @ManyToOne(() => PostEntity, post => post.childrenPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_posts_id' })
    parentPost: PostEntity;

    @Field(tye => [PostEntity])
    @OneToMany(() => PostEntity, post => post.parentPost, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'children_posts' })
    childrenPosts: PostEntity[];
}
