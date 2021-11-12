import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileRequestDto {

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    status: string

    @ApiProperty()
    @IsString()
    about: string

    @ApiProperty()
    @IsString()
    userId: string
}