import { IsString } from 'class-validator';

export class UpdateProfileDto {

    @IsString()
    name: string

    @IsString()
    status: string

    @IsString()
    about: string

    @IsString()
    profileId: string
}