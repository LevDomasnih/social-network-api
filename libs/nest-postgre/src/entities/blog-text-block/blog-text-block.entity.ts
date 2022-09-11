import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCustomEntity, BlogEntity } from '@app/nest-postgre/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import graphqlTypeJson from 'graphql-type-json';

@ObjectType()
export class InlineStyleRanges {
    @Field(type => Int)
    length: number
    @Field(type => Int)
    offset: number
    @Field()
    style: string
}

@ObjectType()
@Entity('blog_text_blocks')
export class BlogTextBlockEntity extends BaseCustomEntity {
    @Field(type => BlogEntity)
    @ManyToOne(() => BlogEntity, post => post.textBlocks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_owner' })
    postOwner: BlogEntity;

    @Field(type => graphqlTypeJson, {nullable: true})
    @Column({
        type: 'jsonb',
        default: () => "'{}'",
        nullable: false,
    })
    data: {};

    @Field(type => Int)
    @Column({ type: 'int' })
    depth: number;

    @Field(type => [String], { nullable: true })
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
        name: 'entity_ranges' }) // может и не строка
    entityRanges: string[];

    @Field(type => [InlineStyleRanges], { nullable: true })
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
        name: 'inline_style_ranges'
    })
    inlineStyleRanges: InlineStyleRanges[];

    @Field()
    @Column({ type: 'varchar' })
    key: string;

    @Field()
    @Column({ type: 'text' })
    text: string;

    @Field()
    @Column({ type: 'varchar' })
    type: string;
}
