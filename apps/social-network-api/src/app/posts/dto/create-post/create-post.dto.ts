import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    parentPost: string;
}
