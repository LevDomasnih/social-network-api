import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCustomEntity, PostEntity } from '@app/nest-postgre/entities';
import { ApiProperty } from '@nestjs/swagger';

export class InlineStyleRanges {
    length: number
    offset: number
    style: string
}

@Entity('post_text_blocks')
export class PostTextBlocksEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => PostEntity })
    @ManyToOne(() => PostEntity, post => post.textBlocks)
    @JoinColumn({ name: 'post_owner' })
    postOwner: PostEntity;

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
    inlineStyleRanges: Array<InlineStyleRanges>;

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