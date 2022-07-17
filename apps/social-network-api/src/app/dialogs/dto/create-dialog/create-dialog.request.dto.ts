import { ArrayMinSize, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogRequestDto {

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    secondOwnerId: string;

    // TODO Пересмотреть
    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    @IsOptional()
    file: string;
}
