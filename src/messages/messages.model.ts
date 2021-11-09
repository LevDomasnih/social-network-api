import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface MessagesModel extends Base {}
export class MessagesModel extends TimeStamps {

    @prop()
    ownerId: string

    @prop()
    text: string

    @prop({ default: '' })
    image: string

    @prop({ default: '' })
    file: string
}