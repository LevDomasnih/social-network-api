import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIds } from '../../validator-helpers/object-id';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogRequestDto {

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
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