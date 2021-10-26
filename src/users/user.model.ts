import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, prop, Ref } from '@typegoose/typegoose';
import { ProfileModel } from '../profile/profile.model';

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
        foreignField: 'userId',
        localField: 'email',
        justOne: true,
    })
    profile: Ref<ProfileModel>

    @Prop({type: () => [String]})
    follow: string[]
}