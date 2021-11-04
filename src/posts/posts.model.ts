import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserModel } from '../users/user.model';

export interface PostsModel extends Base {}
export class PostsModel extends TimeStamps {

    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId
    })
    owner: Ref<UserModel>

    @prop({default: ''})
    text: string

    @prop()
    image: string // TODO file

    @prop({default: 0})
    likes: number

    @prop({default: 0})
    views: number

    @prop({
        ref: () => 'Posts',
        type: () => Types.ObjectId
    })
    comments: Ref<PostsModel>[]
}