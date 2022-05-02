import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileRequestDto {

    @ApiProperty()
    @IsString()
    middleName: string

    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsString()
    phone: string

    @ApiProperty()
    @IsString()
    avatar: string

    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty()
    @IsString()
    login: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    birthday?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    country?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    city?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    relatives?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    school?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    mainImage?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    status?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    about?: string
}
