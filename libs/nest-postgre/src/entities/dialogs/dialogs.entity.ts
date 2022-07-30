import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, MessagesEntity } from '@app/nest-postgre/entities';

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

@Entity('dialogs')
export class DialogsEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => [UserEntity] })
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

    @ApiProperty({ type: () => [MessagesEntity] })
    @OneToMany(() => MessagesEntity, message => message.dialog)
    messages: MessagesEntity[];

    @ApiProperty()
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
