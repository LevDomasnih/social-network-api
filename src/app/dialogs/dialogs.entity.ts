import { Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { MessagesEntity } from '../messages/messages.entity';

// class Options {
//
//     @Column()
//     scale: ''
//
// }

@Entity('dialogs')
export class DialogsEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => [UserEntity] })
    @ManyToMany(() => UserEntity, user => user.dialogs, { onDelete: 'CASCADE', cascade: true })
    @JoinTable()
    owners: UserEntity[];

    @ApiProperty({ type: () => [MessagesEntity] })
    @OneToMany(() => MessagesEntity, message => message.dialog)
    messages: MessagesEntity[];

    // @prop({ type: () => Options})
    // @Column()
    // options: Options
}
