import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {

    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string
}