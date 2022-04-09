import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserModel } from '../users/user.model';
import { ApiProperty } from '@nestjs/swagger';

export interface PostsModel extends Base {}
export class PostsModel extends TimeStamps {

    @ApiProperty({type: () => UserModel})
    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId
    })
    owner: Ref<UserModel>

    @ApiProperty()
    @prop({default: ''})
    text: string

    @ApiProperty()
    @prop()
    image: string // TODO file

    @ApiProperty()
    @prop({default: 0})
    likes: number

    @ApiProperty()
    @prop({default: 0})
    views: number

    @ApiProperty({type: () => [PostsModel]})
    @prop({
        ref: () => 'Posts',
        type: () => Types.ObjectId
    })
    comments: Ref<PostsModel>[]
}