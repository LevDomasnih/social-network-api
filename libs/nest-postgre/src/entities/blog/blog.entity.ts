import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity, BlogTextBlockEntity } from '@app/nest-postgre/entities';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
@Entity('blogs')
export class BlogEntity extends BaseCustomEntity {
    @Field(type => UserEntity)
    @ManyToOne(() => UserEntity, user => user.blogs)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @Field(type => [BlogTextBlockEntity])
    @OneToMany(() => BlogTextBlockEntity, postText => postText.postOwner, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'text_blocks'})
    textBlocks: BlogTextBlockEntity[];

    @Field(type => [String], { nullable: true })
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    headers: string[];

    @Field(type => graphqlTypeJson, {nullable: true})
    @Column({
        type: 'jsonb',
        name: 'entity_map',
        default: () => "'{}'",
        nullable: false,
    })
    entityMap: {}

    @Field(type => FilesEntity)
    @OneToOne(() => FilesEntity, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'main_image_id'})
    mainImage: FilesEntity; // TODO file

    @Field(tye => Int)
    @Column({ default: 0 })
    likes: number;

    @Field(tye => Int)
    @Column({ default: 0 })
    views: number;

    //FIXME Add comments field
}
