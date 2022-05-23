import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity, BlogTextBlockEntity } from '@app/nest-postgre/entities';

@Entity('blogs')
export class BlogEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity })
    @ManyToOne(() => UserEntity, user => user.blogs)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty()
    @OneToMany(() => BlogTextBlockEntity, postText => postText.postOwner, { onDelete: 'CASCADE' })
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

    //FIXME Add comments field
}
