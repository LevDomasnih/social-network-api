import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCustomEntity, BlogEntity } from '@app/nest-postgre/entities';
import { ApiProperty } from '@nestjs/swagger';

export class InlineStyleRanges {
    length: number
    offset: number
    style: string
}

@Entity('blog_text_blocks')
export class BlogTextBlockEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => BlogEntity })
    @ManyToOne(() => BlogEntity, post => post.textBlocks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_owner' })
    postOwner: BlogEntity;

    @ApiProperty()
    @Column({
        type: 'jsonb',
        default: () => "'{}'",
        nullable: false,
    })
    data: {};

    @ApiProperty()
    @Column({ type: 'int' })
    depth: number;

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
        name: 'entity_ranges' }) // может и не строка
    entityRanges: string[];

    @ApiProperty()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
        name: 'inline_style_ranges'
    })
    inlineStyleRanges: InlineStyleRanges[];

    @ApiProperty()
    @Column({ type: 'varchar' })
    key: string;

    @ApiProperty()
    @Column({ type: 'text' })
    text: string;

    @ApiProperty()
    @Column({ type: 'varchar' })
    type: string;
}
