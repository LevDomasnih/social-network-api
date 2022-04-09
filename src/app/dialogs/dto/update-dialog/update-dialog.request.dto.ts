import { IsOptional, IsString, Validate } from 'class-validator';
import { IsObjectId } from '../../../../common/validator-helpers/object-id';
import { Types } from 'mongoose';

export class UpdateDialogRequestDto {

    @IsString()
    text: string

    @IsString()
    dialogId: string

    @IsString()
    @IsOptional()
    image: string

    @IsString()
    @IsOptional()
    file: string
}
