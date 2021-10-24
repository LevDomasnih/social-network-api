import { mongoose, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/users/user.model';

export interface ProfileModel extends Base {}
export class ProfileModel extends TimeStamps {
    @prop({ required: true, ref: () => UserModel})
    userId: mongoose.Types.ObjectId

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