import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {

    @IsString()
    @ApiProperty()
    access_token: string
}