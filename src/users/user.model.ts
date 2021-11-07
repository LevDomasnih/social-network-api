import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';
import { FollowModel } from '../follow/follow.model';
import { PostsModel } from '../posts/posts.model';
import { DialogsModel } from '../dialogs/dialogs.model';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {

    @prop({unique: true})
    email: string

    @prop()
    passwordHash: string

    @prop({default: ''})
    name: string

    @prop({default: ''})
    surname: string

    @prop({
        ref: () => 'Profile',
        type: () => Types.ObjectId
    })
    profile: Ref<ProfileModel>

    @prop({
        ref: () => 'Follow',
        type: () => Types.ObjectId
    })
    follow: Ref<FollowModel>

    @prop({
        ref: () => 'Posts',
        type: () => Types.ObjectId
    })
    posts: Ref<PostsModel>[]

    @prop({
        ref: () => 'Dialogs',
        type: () => Types.ObjectId
    })
    dialogs: Ref<DialogsModel>[]
}