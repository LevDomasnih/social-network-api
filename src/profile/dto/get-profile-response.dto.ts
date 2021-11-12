import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserModel } from '../../users/user.model';
import { ProfileModel } from '../profile.model';
import { Ref } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

export class GetProfileResponseDto extends PartialType(UserModel) {

    @ApiProperty({
        type: () => ProfileModel,
        default: () => ProfileModel
    })
    @IsString()
    profile: Ref<ProfileModel>

}