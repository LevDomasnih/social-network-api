import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../users/user.model';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { MessagesModel } from '../../messages/messages.model';

export class GetDialogResponseDto {

    @ApiProperty({ type: () => [UserModel], default: 'userId'})
    @prop({
        ref: () => 'User',
        type: () => Types.ObjectId,
        required: true
    })
    owners: Ref<UserModel>[]

    @ApiProperty({ type: () => [MessagesModel]})
    @prop({
        ref: () => 'Messages',
        type: () => Types.ObjectId,
        required: true
    })
    messages: Ref<MessagesModel>[]
}