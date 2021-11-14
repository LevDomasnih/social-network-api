import { IsOptional, IsString, Validate } from 'class-validator';
import { IsObjectId } from '../../validator-helpers/object-id';
import { Types } from 'mongoose';

export class UpdateDialogResponseDto {

    @IsString()
    text: string

    @IsString()
    @Validate(IsObjectId, {
        message: 'Id can be a 24 character hex string',
    })
    dialogId: Types.ObjectId

    @IsString()
    @IsOptional()
    image: string

    @IsString()
    @IsOptional()
    file: string
}