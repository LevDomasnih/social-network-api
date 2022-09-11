import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('profiles')
export class ProfileEntity extends BaseCustomEntity {
    @Field(type => UserEntity)
    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @Field(type => String)
    @Column({ name: 'first_name' })
    firstName: string;

    @Field(type => String)
    @Column({ name: 'last_name' })
    lastName: string;

    @Field(type => String, {nullable: true})
    @Column({ name: 'middle_name', nullable: true })
    middleName?: string;

    @Field(type => String)
    @Column()
    phone: string;

    @Field(type => FilesEntity)
    @OneToOne(() => FilesEntity)
    @JoinColumn({ name: 'avatar_id' })
    avatar: FilesEntity;

    @Field(type => FilesEntity)
    @OneToOne(() => FilesEntity)
    @JoinColumn({ name: 'main_image_id' })
    mainImage: FilesEntity;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    status?: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    about?: string;

    @Field(type => Date, { nullable: true })
    @Column({ type: 'timestamp', nullable: true, default: new Date(0) })
    birthday?: Date;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    country?: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    city?: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    relatives?: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    school?: string;
}
