import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIds, IsObjectId } from '../../validator-helpers/object-id';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnersRequestDto {

    @ApiProperty({ type: 'string'})
    @IsNotEmpty()
    @IsString()
    @Validate(IsObjectId, {
        message: 'Id can be a 24 character hex string'
    })
    dialogId: Types.ObjectId

    @ApiProperty({ type: ['string']})
    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1, {
        message: 'Чат не может состоять из одного пользователя'
    })
    @Validate(IsObjectIds, {
        message: 'Id can be a 24 character hex string'
    })
    owners: Types.ObjectId[]
}