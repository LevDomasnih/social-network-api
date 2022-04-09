import { ArrayMinSize, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogRequestDto {

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString({ each: true })
    @ArrayMinSize(1)
    otherOwners: string[];

    // TODO Пересмотреть
    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    @IsOptional()
    file: string;
}
