import { IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsString()
    @ValidateIf((object, value) => value !== null)
    parentPost: string | null;
}
