import { mongoose, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface ProfileModel extends Base {}
export class ProfileModel extends TimeStamps {
    @prop()
    userId: string

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