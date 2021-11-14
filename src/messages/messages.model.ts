import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { DialogsModel } from '../dialogs/dialogs.model';
import { Types } from 'mongoose';

export interface MessagesModel extends Base {}
export class MessagesModel extends TimeStamps {

    @ApiProperty({ type: () => [DialogsModel], default: ['dialogId']})
    @prop({
        ref: () => 'Dialogs',
        type: () => Types.ObjectId
    })
    dialog: Ref<DialogsModel>

    @ApiProperty()
    @prop()
    ownerId: Types.ObjectId

    @ApiProperty()
    @prop()
    text: string

    @ApiProperty()
    @prop({ default: '' })
    image: string

    @ApiProperty()
    @prop({ default: '' })
    file: string
}