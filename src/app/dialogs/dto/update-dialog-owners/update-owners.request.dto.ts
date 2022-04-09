import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIds, IsObjectId } from '../../../../common/validator-helpers/object-id';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnersRequestDto {

    @ApiProperty({ type: 'string'})
    @IsNotEmpty()
    @IsString()
    dialogId: string

    @ApiProperty({ type: ['string']})
    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1, {
        message: 'Чат не может состоять из одного пользователя'
    })
    owners: string[]
}
