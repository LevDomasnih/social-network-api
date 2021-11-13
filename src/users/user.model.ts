import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';
import { FollowModel } from '../follow/follow.model';
import { PostsModel } from '../posts/posts.model';
import { DialogsModel } from '../dialogs/dialogs.model';
import { ApiProperty } from '@nestjs/swagger';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {

    @ApiProperty()
    @prop({unique: true})
    email: string

    @ApiProperty()
    @prop()
    passwordHash: string

    @ApiProperty({ type: () => ProfileModel, default: 'ProfileId'})
    @prop({
        ref: () => 'Profile',
        type: () => Types.ObjectId
    })
    profile: Ref<ProfileModel>

    @ApiProperty({ type: () => FollowModel, default: 'followId'})
    @prop({
        ref: () => 'Follow',
        type: () => Types.ObjectId
    })
    follow: Ref<FollowModel>

    @ApiProperty({ type: () => [PostsModel], default: ['postId']})
    @prop({
        ref: () => 'Posts',
        type: () => Types.ObjectId
    })
    posts: Ref<PostsModel>[]

    @ApiProperty({ type: () => [DialogsModel], default: ['dialogId']})
    @prop({
        ref: () => 'Dialogs',
        type: () => Types.ObjectId
    })
    dialogs: Ref<DialogsModel>[]
}