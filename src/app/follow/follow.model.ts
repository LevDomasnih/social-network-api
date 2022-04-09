import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export interface FollowModel extends Base { }
export class FollowModel extends TimeStamps {

    @ApiProperty()
    @prop()
    userId: string

    @ApiProperty({type: () => UserModel, default: ['userId']})
    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId
    })
    followUser: Ref<UserModel>[]
}