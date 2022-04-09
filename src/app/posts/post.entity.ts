import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';

@Entity('posts')
export class PostEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => UserEntity })
    @ManyToOne(() => UserEntity, user => user.posts)
    owner: UserEntity;

    @ApiProperty()
    @Column({ default: '' })
    text: string;

    @ApiProperty()
    @Column()
    image: string; // TODO file

    @ApiProperty()
    @Column({ default: 0 })
    likes: number;

    @ApiProperty()
    @Column({ default: 0 })
    views: number;

    @ApiProperty({ type: () => [PostEntity] })
    @ManyToOne(() => PostEntity, post => post.childrenPosts)
    parentPosts: PostEntity;

    @ApiProperty({ type: () => [PostEntity] })
    @OneToMany(() => PostEntity, post => post.parentPosts)
    childrenPosts: PostEntity[];
}
