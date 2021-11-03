import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface PostsModel extends Base {}
export class PostsModel extends TimeStamps {

    @prop()
    owner: string

    @prop({default: ''})
    text: string

    @prop()
    image: string // TODO file

    @prop({default: 0})
    likes: number

    @prop({default: 0})
    views: number

    // @prop({default: []})
    // comments: string[] // TODO REF
}