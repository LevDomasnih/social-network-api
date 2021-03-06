import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterRequestDto {

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
    email: string

    @IsString()
    @ApiProperty()
    password: string
}
