import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserModel } from '../user.model';
import { ProfileModel } from '../../profile/profile.model';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class GetUserMeResponseDto extends OmitType(UserModel, ['profile'] as const) {

    @ApiProperty({ type: () => ProfileModel})
    @prop({
        ref: () => 'Profile',
        type: () => Types.ObjectId
    })
    profile: Ref<ProfileModel>
}
