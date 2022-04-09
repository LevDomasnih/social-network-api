import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserModel } from '../users/user.model';
import { MessagesModel } from '../messages/messages.model';
import { ApiProperty } from '@nestjs/swagger';

class Options {

    @prop({required: true})
    scale: ''

}

export interface DialogsModel extends Base {}
export class DialogsModel extends TimeStamps {

    @ApiProperty({ type: () => [UserModel]})
    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId,
        required: true
    })
    owners: Ref<UserModel>[]

    @ApiProperty({ type: () => [MessagesModel]})
    @prop({
        ref: () => 'Messages',
        type: () => Types.ObjectId,
        required: true
    })
    messages: Ref<MessagesModel>[]

    @prop({ type: () => Options})
    options: Options
}