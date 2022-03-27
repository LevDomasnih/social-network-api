import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { DialogsEntity } from '../dialogs/dialogs.entity';

@Entity('messages')
export class MessagesEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => [DialogsEntity], default: ['dialogId'] })
    @OneToOne(() => DialogsEntity, dialog => dialog.id)
    @JoinColumn()
    dialog: DialogsEntity;

    @ApiProperty({ type: () => UserEntity, default: 'owner_id' })
    @OneToOne(() => UserEntity, user => user.id)
    @JoinColumn()
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
