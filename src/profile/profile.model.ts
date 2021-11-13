import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';

export interface ProfileModel extends Base {
}

export class ProfileModel extends TimeStamps {

    @ApiProperty({type: () => UserModel, default: ['ownerId']})
    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId,
        required: true
    })
    owner: Ref<UserModel>

    @ApiProperty()
    @prop({default: ''})
    name: string

    @ApiProperty()
    @prop({default: ''})
    surname: string

    @ApiProperty()
    @prop({default: ''})
    avatar: string

    @ApiProperty()
    @prop({ default: '' })
    status: string;

    @ApiProperty()
    @prop({ default: '' })
    about: string;

    @ApiProperty()
    @prop({ default: '' })
    dateOfBirth: string;

    @ApiProperty()
    @prop({ default: '' })
    country: string;

    @ApiProperty()
    @prop({ default: '' })
    city: string;

    @ApiProperty()
    @prop({ default: '' })
    brothersAndSisters: string;

    @ApiProperty()
    @prop({ default: '' })
    school: string;
}