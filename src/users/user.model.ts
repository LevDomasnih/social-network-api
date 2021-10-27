import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, prop, Ref } from '@typegoose/typegoose';
import { ProfileModel } from '../profile/profile.model';
import { Types } from 'mongoose';

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

    @Prop({type: () => [String]})
    follow: string[]
}