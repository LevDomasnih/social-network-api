import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface ProfileModel extends Base {}
export class ProfileModel extends TimeStamps {

    @prop()
    name: string

    @prop()
    status: string

    @prop()
    about: string

    @prop()
    profileId: string
}