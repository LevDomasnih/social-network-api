import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, MessagesEntity, Status } from '@app/nest-postgre/entities';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

// class Options {
//
//     @Column()
//     scale: ''
//
// }

export enum DialogType {
    CHAT = 'CHAT',
    DIALOGS = 'DIALOGS',
}

registerEnumType(DialogType, { name: 'DialogType' })

@ObjectType()
@Entity('dialogs')
export class DialogsEntity extends BaseCustomEntity {
    @Field(type => [UserEntity])
    @ManyToMany(() => UserEntity, user => user.dialogs, { onDelete: 'CASCADE', cascade: true })
    @JoinTable({
        name: 'dialogs_users',
        joinColumn: {
            name: 'dialogs_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'users_id',
            referencedColumnName: 'id',
        },
    })
    owners: UserEntity[];

    @Field(type => [MessagesEntity])
    @OneToMany(() => MessagesEntity, message => message.dialog)
    messages: MessagesEntity[];

    @Field(type => DialogType)
    @Column({
        type: 'enum',
        enum: DialogType,
        default: DialogType.CHAT,
    })
    status: DialogType;

    // @prop({ type: () => Options})
    // @Column()
    // options: Options
}
