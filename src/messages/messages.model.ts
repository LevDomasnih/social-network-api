import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export interface MessagesModel extends Base {}
export class MessagesModel extends TimeStamps {

    @ApiProperty()
    @prop()
    ownerId: string

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