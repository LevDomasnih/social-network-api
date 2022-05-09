import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';
import { BaseCustomEntity, FilesEntity } from '@app/nest-postgre/entities';

@Entity('messages')
export class MessagesEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => [DialogsEntity], default: ['dialogId'] })
    @ManyToOne(() => DialogsEntity, dialog => dialog.messages)
    @JoinColumn({name: 'dialog_id'})
    dialog: DialogsEntity;

    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @ManyToOne(() => UserEntity, user => user.messages)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty()
    @Column()
    text: string;

    @ApiProperty()
    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity)
    image: string;

    @ApiProperty()
    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity)
    file: string;
}
