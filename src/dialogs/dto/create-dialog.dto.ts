import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIds } from '../../validator-helpers/object-id';

export class CreateDialogDto {

    @IsString()
    text: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @Validate(IsObjectIds, {
        message: 'Id can be a 24 character hex string',
    })
    otherOwners: Types.ObjectId[]

    // TODO вернуть когда будет сделана работа с файлами
    // image: string
    //
    // file: string
}