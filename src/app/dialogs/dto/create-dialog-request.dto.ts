import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIds } from '../../../common/validator-helpers/object-id';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogRequestDto {

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString({ each: true })
    @ArrayMinSize(1)
    otherOwners: string[]

    // TODO Пересмотреть
    @IsString()
    @IsOptional()
    image: string

    @IsString()
    @IsOptional()
    file: string
}
