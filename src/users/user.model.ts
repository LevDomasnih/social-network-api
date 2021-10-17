import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Prop, prop } from '@typegoose/typegoose';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {

    @prop({unique: true})
    email: string

    @prop()
    passwordHash: string

    @prop({default: ''})
    name: string

    @prop({default: ''})
    status: string

    @prop({default: ''})
    about: string

    @Prop({type: () => [String]})
    follow: string[]
}