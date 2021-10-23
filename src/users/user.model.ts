import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, prop, Ref } from '@typegoose/typegoose';

export class Profile {
    @prop({default: ''})
    status: string

    @prop({default: ''})
    about: string

    @prop({default: ''})
    dateOfBirth: string

    @prop({default: ''})
    country: string

    @prop({default: ''})
    city: string

    @prop({default: ''})
    brothersAndSisters: string

    @prop({default: ''})
    school: string
}

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

    @prop({ref: () => Profile})
    profile: Ref<Profile>

    @Prop({type: () => [String]})
    follow: string[]
}