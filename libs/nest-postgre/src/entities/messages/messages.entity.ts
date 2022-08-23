import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';
import { BaseCustomEntity, FilesEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('messages')
export class MessagesEntity extends BaseCustomEntity {
    @Field(type => DialogsEntity)
    @ManyToOne(() => DialogsEntity, dialog => dialog.messages)
    @JoinColumn({name: 'dialog_id'})
    dialog: DialogsEntity;

    @Field(type => UserEntity)
    @ManyToOne(() => UserEntity, user => user.messages)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @Field()
    @Column()
    text: string;

    @Field(type => FilesEntity)
    @OneToOne(() => FilesEntity)
    image: string;

    @Field(type => FilesEntity)
    @OneToOne(() => FilesEntity)
    file: string;
}
