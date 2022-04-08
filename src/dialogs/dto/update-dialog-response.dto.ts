import { IsOptional, IsString, Validate } from 'class-validator';
import { IsObjectId } from '../../validator-helpers/object-id';
import { Types } from 'mongoose';

export class UpdateDialogResponseDto {

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
