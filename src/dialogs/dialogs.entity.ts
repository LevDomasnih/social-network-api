import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../users/user.model';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { MessagesModel } from '../messages/messages.model';
import { UserEntity } from '../users/user.entity';

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

    @ApiProperty({ type: () => [UserModel] })
    @OneToMany(() => UserEntity, user => user.id)
    @JoinColumn()
    owners: UserEntity[];

    @ApiProperty({ type: () => [MessagesModel] })
    @prop({
        ref: () => 'Messages',
        type: () => Types.ObjectId,
        required: true,
    })
    messages: Ref<MessagesModel>[];

    // @prop({ type: () => Options})
    // @Column()
    // options: Options
}
