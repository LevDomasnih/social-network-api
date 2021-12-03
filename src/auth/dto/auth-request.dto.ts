import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRequestDto {

    @IsString()
    @ApiProperty()
    firstName: string

    @IsString()
    @ApiProperty()
    lastName: string

    @IsString()
    @ApiProperty()
    phone: string

    @IsString()
    @ApiProperty()
    login: string

    @IsString()
    @ApiProperty()
    password: string
}