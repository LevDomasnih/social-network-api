import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';

@Entity('messages')
export class MessagesEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => [DialogsEntity], default: ['dialogId'] })
    @ManyToOne(() => DialogsEntity, dialog => dialog.messages)
    dialog: DialogsEntity;

    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @ManyToOne(() => UserEntity, user => user.messages)
    owner: UserEntity;

    @ApiProperty()
    @Column()
    text: string;

    @ApiProperty()
    @Column({ default: '' })
    image: string;

    @ApiProperty()
    @Column({ default: '' })
    file: string;
}
