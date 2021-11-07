import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserModel } from '../users/user.model';
import { MessagesModel } from '../messages/messages.model';

export interface DialogsModel extends Base {}
export class DialogsModel extends TimeStamps {

    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId,
        required: true
    })
    owners: Ref<UserModel>

    @prop({
        ref: () => 'Messages',
        type: () => Types.ObjectId,
        required: true
    })
    messages: Ref<MessagesModel>[]
}